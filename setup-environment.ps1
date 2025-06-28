# PawRx Environment Setup Script
Write-Host "🔧 Setting up PawRx Environment Files..." -ForegroundColor Green

# Function to prompt for input with default
function Get-UserInput {
    param($Prompt, $Default = "")
    if ($Default) {
        $input = Read-Host "$Prompt [$Default]"
        if ([string]::IsNullOrWhiteSpace($input)) { return $Default }
        return $input
    } else {
        return Read-Host $Prompt
    }
}

Write-Host ""
Write-Host "📋 This script will help you create environment files for PawRx" -ForegroundColor Yellow
Write-Host "💡 Press Enter to use default values in [brackets]" -ForegroundColor Cyan
Write-Host ""

# Get API Keys
Write-Host "🔑 API Keys Configuration:" -ForegroundColor Blue
$openaiKey = Get-UserInput "OpenAI API Key (get from https://platform.openai.com/api-keys)"

# Generate JWT Secret
$jwtSecret = Get-UserInput "JWT Secret (press Enter to auto-generate)" ""
if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
    $jwtSecret = [System.Web.Security.Membership]::GeneratePassword(32, 10)
    Write-Host "✅ Generated JWT Secret: $jwtSecret" -ForegroundColor Green
}

# Database configuration
Write-Host ""
Write-Host "🗄️ Database Configuration:" -ForegroundColor Blue
$mongoUri = Get-UserInput "MongoDB URI" "mongodb://localhost:27017/pawrx"

# Email configuration (optional)
Write-Host ""
Write-Host "📧 Email Configuration (optional - for alerts):" -ForegroundColor Blue
$emailUser = Get-UserInput "Email address (optional)" ""
$emailPass = ""
if ($emailUser) {
    $emailPass = Get-UserInput "Email app password (not regular password)" ""
}

# Create ML environment file
Write-Host ""
Write-Host "📝 Creating ml/.env..." -ForegroundColor Yellow
$mlEnvContent = @"
PORT=8000
ENVIRONMENT=development
OPENAI_API_KEY=$openaiKey
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
"@

if (!(Test-Path "ml")) { New-Item -ItemType Directory -Path "ml" }
$mlEnvContent | Out-File -FilePath "ml/.env" -Encoding utf8

# Create server environment file
Write-Host "📝 Creating server/.env..." -ForegroundColor Yellow
$serverEnvContent = @"
# Database
MONGODB_URI=$mongoUri

# Authentication
JWT_SECRET=$jwtSecret
JWT_EXPIRE=30d

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Server
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
"@

if ($emailUser) {
    $serverEnvContent += @"

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=$emailUser
EMAIL_PASS=$emailPass
"@
}

if (!(Test-Path "server")) { New-Item -ItemType Directory -Path "server" }
$serverEnvContent | Out-File -FilePath "server/.env" -Encoding utf8

# Create client environment file
Write-Host "📝 Creating client/.env..." -ForegroundColor Yellow
$clientEnvContent = @"
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ML_URL=http://localhost:8000
"@

if (!(Test-Path "client")) { New-Item -ItemType Directory -Path "client" }
$clientEnvContent | Out-File -FilePath "client/.env" -Encoding utf8

Write-Host ""
Write-Host "✅ Environment files created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Created files:" -ForegroundColor Cyan
Write-Host "  ├── ml/.env" -ForegroundColor Gray
Write-Host "  ├── server/.env" -ForegroundColor Gray
Write-Host "  └── client/.env" -ForegroundColor Gray
Write-Host ""

if ([string]::IsNullOrWhiteSpace($openaiKey)) {
    Write-Host "⚠️  WARNING: No OpenAI API key provided!" -ForegroundColor Red
    Write-Host "   ML service will run with limited functionality" -ForegroundColor Yellow
    Write-Host "   Get your key from: https://platform.openai.com/api-keys" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "🚀 Next steps:" -ForegroundColor Green
Write-Host "1. Install dependencies: ./install-dependencies.ps1" -ForegroundColor White
Write-Host "2. Start all services: ./start-ml-dev.ps1" -ForegroundColor White
Write-Host "3. Test the application: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed setup guide, see: API-KEYS-SETUP.md" -ForegroundColor Cyan 