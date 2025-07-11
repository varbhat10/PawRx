from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from openai import OpenAI
import os
from dotenv import load_dotenv
import json
import uvicorn
import logging

# Load environment variables (only in development)
if not os.getenv('RAILWAY_ENVIRONMENT'):
    load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Startup logging
print("=" * 50)
print("🚀 Starting PawRX ML Service")
print(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
print(f"Port: {os.getenv('PORT', '8080')}")
print(f"OpenAI API Key: {'✓ Present' if os.getenv('OPENAI_API_KEY') else '✗ Missing'}")
print("=" * 50)

app = FastAPI(
    title="PawRX AI Service",
    description="AI-powered medication analysis for pet safety",
    version="1.0.0"
)

# Configure CORS - Disabled for Railway health checks
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000", 
#         "http://localhost:5000", 
#         "https://pawrx-production-5c30.up.railway.app",
#         "https://pawrx-ml-production.up.railway.app"
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Configure OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key:
    openai_client = OpenAI(api_key=openai_api_key)
else:
    openai_client = None
    logger.warning("OpenAI API key not found. ML service will run with limited functionality.")

# Pydantic models
class PetInfo(BaseModel):
    species: str
    breed: Optional[str] = None
    weight: float
    weightUnit: str
    age: int
    ageUnit: str
    medicalHistory: Optional[Dict[str, Any]] = None

class Medication(BaseModel):
    name: str
    brandName: Optional[str] = None
    dosage: str
    frequency: str
    route: Optional[str] = "oral"

class MedicationAnalysisRequest(BaseModel):
    pet: PetInfo
    medications: List[Medication]
    query: Optional[str] = None

class AIAnalysisResponse(BaseModel):
    analysis: str
    riskLevel: str
    recommendations: List[str]
    alternatives: Optional[List[str]] = None
    warnings: Optional[List[str]] = None
    sources: Optional[List[str]] = None

# Routes
@app.get("/")
async def root():
    return {"message": "PawRX AI Service", "status": "running"}

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {
        "message": "PawRX ML Service",
        "status": "healthy",
        "service": "PawRX AI",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    logger.info("Health check endpoint accessed")
    try:
        # Test OpenAI connection
        openai_status = "connected" if openai_client else "not configured"
        
        return {
            "status": "healthy",
            "service": "PawRX AI",
            "version": "1.0.0",
            "openai": openai_status,
            "port": os.getenv("PORT", "8080"),
            "environment": os.getenv("ENVIRONMENT", "development")
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }

@app.post("/analyze-medications", response_model=AIAnalysisResponse)
async def analyze_medications(request: MedicationAnalysisRequest):
    """
    Analyze pet medications using GPT for potential risks and interactions
    """
    try:
        # Prepare the prompt for GPT
        prompt = create_analysis_prompt(request.pet, request.medications, request.query)
        
        # Call OpenAI API
        response = await call_openai_api(prompt)
        
        # Parse the response
        analysis_result = parse_ai_response(response)
        
        return analysis_result
        
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/check-drug-interactions")
async def check_drug_interactions(medications: List[str], species: str):
    """
    Check for known drug interactions using AI analysis
    """
    try:
        prompt = f"""
        Analyze potential drug interactions for a {species} with the following medications:
        {', '.join(medications)}
        
        Provide a JSON response with:
        - interactions: list of potential interactions
        - riskLevel: overall risk level (Low/Medium/High/Critical)
        - recommendations: safety recommendations
        """
        
        response = await call_openai_api(prompt)
        result = parse_ai_response(response)
        
        return result
        
    except Exception as e:
        logger.error(f"Interaction check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Interaction check failed: {str(e)}")

@app.post("/get-medication-alternatives")
async def get_medication_alternatives(medication: str, species: str, condition: Optional[str] = None):
    """
    Get alternative medications using AI recommendations
    """
    try:
        condition_text = f" for treating {condition}" if condition else ""
        
        prompt = f"""
        Suggest safe alternative medications to {medication} for a {species}{condition_text}.
        
        Provide alternatives that are:
        1. Safe for the species
        2. Effective for the same condition
        3. Have different mechanisms of action to avoid similar side effects
        
        Format as JSON with alternatives array.
        """
        
        response = await call_openai_api(prompt)
        result = parse_ai_response(response)
        
        return result
        
    except Exception as e:
        logger.error(f"Alternative suggestion failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Alternative suggestion failed: {str(e)}")

@app.post("/safety-check")
async def safety_check(medication: str, species: str, weight: float, age: int):
    """
    Quick safety check for a specific medication
    """
    try:
        prompt = f"""
        As a veterinary expert, assess the safety of this medication for the specified pet:
        
        Medication: {medication}
        Species: {species}
        Weight: {weight}kg
        Age: {age} years
        
        Please provide:
        1. Safety assessment (Safe/Caution/Dangerous)
        2. Appropriate dosage range if safe
        3. Key warnings or contraindications
        4. Monitoring recommendations
        
        Format as JSON:
        {{
            "safety": "Safe/Caution/Dangerous",
            "dosage_guidance": "dosage information",
            "warnings": ["warning1", "warning2"],
            "monitoring": "monitoring advice"
        }}
        """
        
        response = await call_openai_api(prompt)
        
        try:
            safety_data = json.loads(response)
            return safety_data
        except json.JSONDecodeError:
            return {"safety": "Unknown", "error": "Could not parse AI response"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Safety check failed: {str(e)}")

# Helper functions
def create_analysis_prompt(pet: PetInfo, medications: List[Medication], query: Optional[str]) -> str:
    """Create a detailed prompt for medication analysis"""
    
    med_list = "\n".join([
        f"- {med.name} ({med.brandName if med.brandName else 'generic'}): {med.dosage}, {med.frequency}, {med.route}"
        for med in medications
    ])
    
    medical_history = ""
    if pet.medicalHistory:
        if pet.medicalHistory.get('allergies'):
            medical_history += f"Allergies: {', '.join(pet.medicalHistory['allergies'])}\n"
        if pet.medicalHistory.get('chronicConditions'):
            medical_history += f"Chronic Conditions: {', '.join(pet.medicalHistory['chronicConditions'])}\n"
    
    prompt = f"""
    You are a veterinary pharmacology expert. Analyze the following medication regimen for potential risks, interactions, and safety concerns.

    Pet Information:
    - Species: {pet.species}
    - Breed: {pet.breed if pet.breed else 'Not specified'}
    - Weight: {pet.weight} {pet.weightUnit}
    - Age: {pet.age} {pet.ageUnit}
    {medical_history}

    Current Medications:
    {med_list}

    Analysis Request: {query if query else 'Provide a comprehensive safety analysis'}

    Please provide a CONCISE analysis (maximum 3-4 sentences) that MATCHES the risk level you assign:
    
    For Low risk: Focus on routine monitoring and standard precautions
    For Medium risk: Mention moderate concerns and increased monitoring 
    For High risk: Emphasize significant safety concerns requiring close supervision
    For Critical risk: Stress immediate danger and need for emergency intervention
    
    The analysis text MUST be consistent with your assigned risk level.

    Format your response as JSON with this structure:
    {{
        "analysis": "brief 3-4 sentence analysis",
        "riskLevel": "Low/Medium/High/Critical",
        "recommendations": ["max 3 short, actionable recommendations"],
        "alternatives": ["max 2 brief alternatives if needed"],
        "warnings": ["max 2 key warnings if needed"],
        "sources": ["max 3 relevant veterinary sources"]
    }}

    Keep all fields concise and focused on the most important information only.
    """
    
    return prompt

async def call_openai_api(prompt: str) -> str:
    """Call OpenAI API with the given prompt"""
    try:
        if not openai_client or not openai_client.api_key:
            # Return a fallback response if OpenAI is not configured
            return json.dumps({
                "analysis": "AI analysis unavailable - OpenAI API key not configured. Please consult with your veterinarian for medication safety advice.",
                "riskLevel": "Unknown",
                "recommendations": [
                    "Consult with your veterinarian",
                    "Monitor your pet for adverse reactions",
                    "Keep detailed medication records"
                ],
                "alternatives": [],
                "warnings": ["Professional veterinary guidance recommended"],
                "sources": []
            })
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a veterinary pharmacology expert providing medication safety analysis."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.3
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        logger.error(f"OpenAI API call failed: {str(e)}")
        # Return fallback response
        return json.dumps({
            "analysis": f"AI analysis temporarily unavailable: {str(e)}. Please consult with your veterinarian.",
            "riskLevel": "Unknown",
            "recommendations": [
                "Consult with your veterinarian immediately",
                "Monitor your pet closely",
                "Keep all medication records"
            ],
            "alternatives": [],
            "warnings": ["Seek professional veterinary advice"],
            "sources": []
        })

def parse_ai_response(response: str) -> AIAnalysisResponse:
    """Parse AI response into structured format"""
    try:
        # Clean the response first
        cleaned_response = response.strip()
        
        # Remove markdown code block markers if present
        if cleaned_response.startswith('```json'):
            cleaned_response = cleaned_response[7:]  # Remove ```json
        if cleaned_response.startswith('```'):
            cleaned_response = cleaned_response[3:]   # Remove ```
        if cleaned_response.endswith('```'):
            cleaned_response = cleaned_response[:-3]  # Remove trailing ```
        
        cleaned_response = cleaned_response.strip()
        
        # Try to parse as JSON
        if cleaned_response.startswith('{'):
            data = json.loads(cleaned_response)
            
            # Clean the parsed data
            if 'analysis' in data and isinstance(data['analysis'], str):
                # Remove extra quotes and clean up
                data['analysis'] = data['analysis'].strip('"').replace('\\"', '"')
            
            # Clean arrays
            for field in ['recommendations', 'alternatives', 'warnings', 'sources']:
                if field in data and isinstance(data[field], list):
                    data[field] = [item.strip('"').replace('\\"', '"') for item in data[field] if item]
            
            # Clean risk level
            if 'riskLevel' in data and isinstance(data['riskLevel'], str):
                data['riskLevel'] = data['riskLevel'].strip('"')
            
            return AIAnalysisResponse(**data)
        else:
            # If not JSON, create a structured response
            return AIAnalysisResponse(
                analysis=cleaned_response,
                riskLevel="Medium",
                recommendations=["Consult with your veterinarian for detailed guidance"],
                alternatives=[],
                warnings=["Professional veterinary consultation recommended"],
                sources=[]
            )
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {e}")
        logger.error(f"Raw response: {response}")
        # Fallback for non-JSON responses
        return AIAnalysisResponse(
            analysis="Unable to parse AI response. Please consult with your veterinarian for medication safety advice.",
            riskLevel="Unknown",
            recommendations=["Please consult with your veterinarian"],
            alternatives=[],
            warnings=["Unable to parse AI response properly"],
            sources=[]
        )

if __name__ == "__main__":
    # Railway requires binding to 0.0.0.0 and using Railway's PORT
    port = int(os.environ.get("PORT", 8080))
    print(f"🚀 Starting uvicorn server on 0.0.0.0:{port}")
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port,
        log_level="info",
        access_log=True,
        server_header=False,
        date_header=False
    ) 