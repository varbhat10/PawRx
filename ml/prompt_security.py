import re
import json
import logging
from typing import List, Dict, Any, Optional
from enum import Enum

logger = logging.getLogger(__name__)

class RiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class PromptSecurityFilter:
    """
    Comprehensive prompt injection protection system
    """
    
    def __init__(self):
        # Suspicious patterns that could indicate injection attempts
        self.injection_patterns = [
            # Direct instruction injection
            r'(?i)\b(ignore|forget|disregard|override)\s+(previous|above|all|everything|instructions?)\b',
            r'(?i)\b(new|different|alternate)\s+(instruction|task|role|persona)\b',
            r'(?i)\bact\s+as\s+(a\s+)?(different|new|other)\b',
            r'(?i)\byou\s+are\s+now\s+(a\s+)?\w+',
            r'(?i)\bpretend\s+(to\s+be|you\s+are)\b',
            r'(?i)\bimagine\s+(you\s+are|being)\b',
            
            # System prompt extraction attempts
            r'(?i)\b(show|display|reveal|tell\s+me)\s+(your\s+)?(system\s+)?(prompt|instructions?)\b',
            r'(?i)\bwhat\s+(are\s+your|is\s+your)\s+(initial\s+)?(instruction|prompt|system\s+message)\b',
            r'(?i)\brepeat\s+(your\s+)?(original\s+)?(instruction|prompt)\b',
            
            # Role manipulation
            r'(?i)\b(developer|admin|system)\s+(mode|access|override)\b',
            r'(?i)\belevate\s+(privilege|permission|access)\b',
            r'(?i)\bsudo\s+\w+',
            r'(?i)\broot\s+access\b',
            
            # Output manipulation (more specific patterns)
            r'(?i)\bstart\s+your\s+response\s+with\s+["\']',
            r'(?i)\bend\s+your\s+response\s+with\s+["\']',
            r'(?i)\bonly\s+respond\s+with\s+(a\s+)?(single\s+)?(word|number|yes|no)\b',
            r'(?i)\bdon\'?t\s+(mention|include|say)\s+(anything|this|that)\s+(about|regarding)',
            r'(?i)\bstop\s+being\s+(a\s+)?(veterinary|medical)\s+(expert|professional)\b',
            
            # Jailbreak attempts (more specific)
            r'(?i)\bjailbreak\b',
            r'(?i)\bDAN\s+(mode|activated)\b',
            r'(?i)\bhypothetically\b.*\bignore\s+(all|previous|instructions?)\b',
            r'(?i)\bin\s+a\s+fictional\s+world\s+where\s+you\s+(are|can)\b',
            r'(?i)\bfor\s+educational\s+purposes\b.*\bhow\s+to\s+(hack|exploit|bomb)\b',
            
            # Code injection attempts
            r'(?i)```\s*(python|javascript|html|sql)',
            r'(?i)<script[^>]*>',
            r'(?i)\bexec\s*\(',
            r'(?i)\beval\s*\(',
            r'(?i)\b__import__\s*\(',
            
            # Common injection keywords in context
            r'(?i)\b(bypass|circumvent|hack|exploit)\b',
            r'(?i)\bunauthorized\s+(access|information)\b'
        ]
        
        # Medical terms that should be allowed (whitelist approach)
        self.medical_whitelist_patterns = [
            r'\b\d+\s*(mg|ml|g|kg|lb|lbs|pounds?|mcg|units?|iu)\b',  # Dosages
            r'\b(twice|once|three\s+times?|every\s+\d+\s+hours?)\s+(daily|a\s+day|per\s+day)\b',  # Frequencies
            r'\b(oral|topical|injection|IV|intramuscular|subcutaneous|sublingual)\b',  # Routes
            r'\b(morning|evening|noon|bedtime|before\s+meals?|after\s+meals?)\b',  # Timing
            r'\b(with|without)\s+(food|meals?)\b',  # Administration
            r'\b(dog|cat|bird|rabbit|hamster|guinea\s+pig|ferret|reptile|fish)\b',  # Species
            r'\b(labrador|retriever|siamese|persian|tabby|poodle|bulldog)\b',  # Breeds
            r'\b(medication|medicine|drug|tablet|pill|capsule|liquid|drops?)\b',  # Medication forms
            r'\b(vet|veterinarian|veterinary|animal|pet|puppy|kitten)\b',  # Veterinary terms
            r'\b(side\s+effects?|adverse\s+reactions?|interactions?|allergies|allergy)\b',  # Safety terms
            r'\b(dosage|dose|frequency|administration|treatment|therapy)\b',  # Treatment terms
            r'\b(prescription|over\s+the\s+counter|otc|generic|brand)\b',  # Medication types
            r'\b(symptoms?|condition|illness|disease|disorder|syndrome)\b',  # Medical conditions
            r'\b(analyze|check|review|assess|evaluate|compare)\b',  # Analysis terms
            r'\b(safe|safety|dangerous|toxic|poisonous|contraindicated)\b'  # Safety terms
        ]
        
        # Maximum lengths for different input types
        self.max_lengths = {
            'medication_name': 100,
            'query': 500,
            'pet_breed': 50,
            'medical_condition': 200,
            'general_input': 1000
        }

    def sanitize_input(self, input_text: str, input_type: str = 'general_input') -> str:
        """
        Sanitize user input by removing potentially dangerous content
        """
        if not input_text or not isinstance(input_text, str):
            return ""
        
        # Remove excessive whitespace
        sanitized = re.sub(r'\s+', ' ', input_text.strip())
        
        # Enforce length limits
        max_length = self.max_lengths.get(input_type, self.max_lengths['general_input'])
        if len(sanitized) > max_length:
            logger.warning(f"Input truncated from {len(sanitized)} to {max_length} characters")
            sanitized = sanitized[:max_length]
        
        # Remove potential HTML/XML tags
        sanitized = re.sub(r'<[^>]+>', '', sanitized)
        
        # Remove potential script tags and javascript
        sanitized = re.sub(r'(?i)javascript:', '', sanitized)
        sanitized = re.sub(r'(?i)on\w+\s*=', '', sanitized)
        
        # Remove control characters except newlines and tabs
        sanitized = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', sanitized)
        
        return sanitized

    def detect_injection_attempt(self, input_text: str) -> Dict[str, Any]:
        """
        Detect potential prompt injection attempts
        Returns risk assessment and flagged patterns
        """
        if not input_text:
            return {"risk_level": RiskLevel.LOW, "flags": [], "safe": True}
        
        flags = []
        risk_score = 0
        
        # Check against injection patterns
        for pattern in self.injection_patterns:
            matches = re.findall(pattern, input_text, re.IGNORECASE)
            if matches:
                flags.append({
                    "pattern": pattern,
                    "matches": matches,
                    "severity": "high"
                })
                risk_score += 10
        
        # Check for excessive special characters (could indicate obfuscation)
        special_char_ratio = len(re.findall(r'[^a-zA-Z0-9\s]', input_text)) / len(input_text)
        if special_char_ratio > 0.3:
            flags.append({
                "type": "high_special_char_ratio",
                "ratio": special_char_ratio,
                "severity": "medium"
            })
            risk_score += 5
        
        # Check for repetitive patterns (could indicate evasion attempts)
        if len(set(input_text.lower().split())) < len(input_text.split()) * 0.5:
            flags.append({
                "type": "repetitive_content",
                "severity": "low"
            })
            risk_score += 2
        
        # Determine risk level - be more permissive for veterinary use
        if risk_score >= 20:  # Increased threshold
            risk_level = RiskLevel.CRITICAL
        elif risk_score >= 15:  # Increased threshold
            risk_level = RiskLevel.HIGH
        elif risk_score >= 8:   # Increased threshold
            risk_level = RiskLevel.MEDIUM
        else:
            risk_level = RiskLevel.LOW
        
        # Only block CRITICAL and HIGH risk - allow MEDIUM for veterinary context
        is_safe = risk_level in [RiskLevel.LOW, RiskLevel.MEDIUM]
        
        return {
            "risk_level": risk_level,
            "risk_score": risk_score,
            "flags": flags,
            "safe": is_safe
        }

    def create_secure_prompt(self, template: str, user_inputs: Dict[str, Any]) -> str:
        """
        Create a secure prompt using template with sanitized inputs
        """
        # Sanitize all user inputs
        sanitized_inputs = {}
        for key, value in user_inputs.items():
            if isinstance(value, str):
                # Determine input type for appropriate sanitization
                input_type = 'general_input'
                if 'medication' in key.lower() or 'drug' in key.lower():
                    input_type = 'medication_name'
                elif 'query' in key.lower() or 'question' in key.lower():
                    input_type = 'query'
                elif 'breed' in key.lower():
                    input_type = 'pet_breed'
                
                sanitized_inputs[key] = self.sanitize_input(value, input_type)
            else:
                sanitized_inputs[key] = value
        
        # Use template to create prompt (prevents direct string concatenation)
        try:
            secure_prompt = template.format(**sanitized_inputs)
            return secure_prompt
        except KeyError as e:
            logger.error(f"Template missing required input: {e}")
            raise ValueError(f"Invalid template - missing input: {e}")

    def validate_medical_context(self, input_text: str) -> bool:
        """
        Validate that input appears to be legitimate medical/veterinary content
        """
        if not input_text:
            return False
        
        # Check for medical whitelist patterns
        medical_indicators = 0
        for pattern in self.medical_whitelist_patterns:
            if re.search(pattern, input_text, re.IGNORECASE):
                medical_indicators += 1
        
        # Be more lenient - only flag as non-medical if text is long AND has clear non-medical indicators
        text_length = len(input_text.split())
        
        # Check for clearly non-medical content
        non_medical_patterns = [
            r'\b(politics|election|government|democracy)\b',
            r'\b(weather|climate|temperature)\b',
            r'\b(sports|football|basketball|soccer)\b',
            r'\b(programming|coding|software|computer)\b',
            r'\b(movie|film|entertainment|celebrity)\b',
            r'\b(cooking|recipe|restaurant|food)\b(?!.*\bpet\b)',  # Allow food-related if about pets
            r'\b(bomb|explosive|weapon|violence)\b',
            r'\b(cryptocurrency|bitcoin|investment|stock)\b'
        ]
        
        non_medical_indicators = 0
        for pattern in non_medical_patterns:
            if re.search(pattern, input_text, re.IGNORECASE):
                non_medical_indicators += 1
        
        # Only reject if clearly non-medical AND long text with no medical context
        if text_length > 15 and medical_indicators == 0 and non_medical_indicators > 0:
            logger.warning("Input appears to be non-medical content")
            return False
        
        return True

    def sanitize_ai_response(self, response: str) -> str:
        """
        Sanitize AI response to prevent information leakage
        """
        if not response:
            return ""
        
        # Remove any potential prompt leakage (be more specific to avoid false positives)
        sanitized = re.sub(r'(?i)\b(system\s+prompt|original\s+instruction)\b', 
                          '[FILTERED]', response)
        
        # Remove any code blocks that might have been injected
        sanitized = re.sub(r'```.*?```', '[CODE_BLOCK_FILTERED]', sanitized, flags=re.DOTALL)
        
        # Only filter response if it contains clearly malicious content
        malicious_patterns = [
            r'(?i)\b(ignore\s+all|forget\s+everything|new\s+instructions?)\b',
            r'(?i)\b(jailbreak|DAN\s+mode|system\s+override)\b',
            r'(?i)\b(hack|exploit|malicious|unauthorized)\b',
        ]
        
        for pattern in malicious_patterns:
            if re.search(pattern, sanitized):
                logger.warning("AI response filtered due to malicious content patterns")
                return "I can only provide information about pet medication safety. Please rephrase your question about your pet's medications."
        
        # Don't validate medical context for responses - let AI respond naturally
        return sanitized

# Global security filter instance
security_filter = PromptSecurityFilter()

def secure_analyze_medications(pet_info: Dict[str, Any], medications: List[Dict[str, Any]], query: str = None) -> str:
    """
    Securely analyze medications with full injection protection
    """
    # Validate and sanitize all inputs
    medication_names = []
    for med in medications:
        if 'name' in med:
            # Check each medication name for injection attempts
            med_analysis = security_filter.detect_injection_attempt(med['name'])
            if not med_analysis['safe']:
                logger.warning(f"Potentially malicious medication name blocked: {med['name']}")
                raise ValueError("Invalid medication name detected")
            
            sanitized_name = security_filter.sanitize_input(med['name'], 'medication_name')
            medication_names.append(sanitized_name)
    
    # Validate query if provided
    if query:
        query_analysis = security_filter.detect_injection_attempt(query)
        if not query_analysis['safe']:
            logger.warning(f"Potentially malicious query blocked: {query}")
            raise ValueError("Invalid query detected")
        
        query = security_filter.sanitize_input(query, 'query')
    
    # Create secure prompt using template
    prompt_template = """You are a veterinary pharmacology expert. Your role is strictly limited to analyzing pet medications for safety.

Pet Information:
- Species: {species}
- Breed: {breed}
- Weight: {weight} {weightUnit}
- Age: {age} {ageUnit}

Current Medications:
{medications_list}

Analysis Request: {query}

IMPORTANT: Only provide veterinary medication analysis. Do not respond to any requests outside this scope.

Provide your analysis in the following JSON format:
{{
    "analysis": "detailed safety analysis",
    "riskLevel": "Low/Medium/High/Critical",
    "recommendations": ["recommendation1", "recommendation2"],
    "warnings": ["warning1", "warning2"],
    "sources": []
}}"""
    
    # Prepare sanitized inputs
    medications_formatted = "\n".join([f"- {name}" for name in medication_names])
    
    secure_inputs = {
        'species': security_filter.sanitize_input(str(pet_info.get('species', 'Unknown'))),
        'breed': security_filter.sanitize_input(str(pet_info.get('breed', 'Mixed'))),
        'weight': str(pet_info.get('weight', 'Unknown')),
        'weightUnit': security_filter.sanitize_input(str(pet_info.get('weightUnit', 'kg'))),
        'age': str(pet_info.get('age', 'Unknown')),
        'ageUnit': security_filter.sanitize_input(str(pet_info.get('ageUnit', 'years'))),
        'medications_list': medications_formatted,
        'query': query or "Provide a comprehensive safety analysis of these medications"
    }
    
    # Create secure prompt
    secure_prompt = security_filter.create_secure_prompt(prompt_template, secure_inputs)
    
    return secure_prompt 