import os
import sys
import uvicorn

print("🔧 Railway startup script starting...")
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")
print(f"Environment variables:")
print(f"  PORT: {os.environ.get('PORT', 'Not set')}")
print(f"  ENVIRONMENT: {os.environ.get('ENVIRONMENT', 'Not set')}")
print(f"  OPENAI_API_KEY: {'Present' if os.environ.get('OPENAI_API_KEY') else 'Not set'}")

try:
    print("🔄 Importing FastAPI app...")
    from main import app
    print("✅ App imported successfully")
    
    port = int(os.environ.get("PORT", 8080))
    print(f"🚀 Starting server on port {port}...")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port, 
        log_level="info",
        access_log=True
    )
except Exception as e:
    print(f"❌ Error starting server: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1) 