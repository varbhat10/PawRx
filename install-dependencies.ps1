# PawRx Dependencies Installation Script
Write-Host "📦 Installing PawRx Dependencies..." -ForegroundColor Green

# Check if required tools are installed
$tools = @("node", "python", "npm")
foreach ($tool in $tools) {
    try {
        $version = & $tool --version 2>&1
        Write-Host "✅ $tool found: $version" -ForegroundColor Green
    } catch {
        Write-Host "❌ $tool not found. Please install $tool first." -ForegroundColor Red
        Write-Host "   Node.js: https://nodejs.org/" -ForegroundColor Yellow
        Write-Host "   Python: https://python.org/" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""

# Install ML Service Dependencies
Write-Host "🤖 Installing ML Service dependencies..." -ForegroundColor Blue
try {
    Set-Location ml
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
    Write-Host "✅ ML Service dependencies installed" -ForegroundColor Green
    Set-Location ..
} catch {
    Write-Host "❌ Failed to install ML dependencies: $_" -ForegroundColor Red
    Set-Location ..
}

# Install Server Dependencies
Write-Host "🔧 Installing Backend Server dependencies..." -ForegroundColor Blue
try {
    Set-Location server
    npm install
    Write-Host "✅ Backend Server dependencies installed" -ForegroundColor Green
    Set-Location ..
} catch {
    Write-Host "❌ Failed to install server dependencies: $_" -ForegroundColor Red
    Set-Location ..
}

# Install Client Dependencies
Write-Host "🌐 Installing Frontend Client dependencies..." -ForegroundColor Blue
try {
    Set-Location client
    npm install
    Write-Host "✅ Frontend Client dependencies installed" -ForegroundColor Green
    Set-Location ..
} catch {
    Write-Host "❌ Failed to install client dependencies: $_" -ForegroundColor Red
    Set-Location ..
}

Write-Host ""
Write-Host "🎉 All dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set up environment: ./setup-environment.ps1" -ForegroundColor White
Write-Host "2. Start all services: ./start-ml-dev.ps1" -ForegroundColor White
Write-Host ""
Write-Host "📊 Dependency summary:" -ForegroundColor Yellow
Write-Host "  ML Service: FastAPI, OpenAI, Uvicorn" -ForegroundColor Gray
Write-Host "  Backend: Express.js, MongoDB, JWT" -ForegroundColor Gray  
Write-Host "  Frontend: React, Tailwind CSS" -ForegroundColor Gray 