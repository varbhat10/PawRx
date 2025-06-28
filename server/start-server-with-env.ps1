# Set environment variables for the server
$env:NODE_ENV = "development"
$env:PORT = "5000"
$env:MONGODB_URI = "mongodb://localhost:27017/medicheck-pet"
$env:JWT_SECRET = "CHANGE-THIS-TO-YOUR-SECURE-JWT-SECRET"
$env:JWT_EXPIRE = "30d"
$env:JWT_COOKIE_EXPIRE = "30"
$env:ML_SERVICE_URL = "http://localhost:8000"
$env:CORS_ORIGIN = "http://localhost:3000"

Write-Host "🚀 Starting MediCheck Pet Server with environment variables..." -ForegroundColor Green
Write-Host "📧 Demo Accounts:" -ForegroundColor Cyan
Write-Host "   Pet Owner: user@demo.com / password123" -ForegroundColor White
Write-Host "   Veterinarian: vet@demo.com / password123" -ForegroundColor White
Write-Host ""

# Start the server
npm start 