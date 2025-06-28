# Complete PawRx Development Environment with ML
Write-Host "🚀 Starting PawRx Development Environment with ML Service..." -ForegroundColor Green

# Check if required tools are installed
$tools = @("node", "python", "npm")
foreach ($tool in $tools) {
    try {
        $version = & $tool --version 2>&1
        Write-Host "✅ $tool found: $version" -ForegroundColor Green
    } catch {
        Write-Host "❌ $tool not found. Please install $tool first." -ForegroundColor Red
        exit 1
    }
}

# Function to start services in parallel
function Start-Service {
    param($Name, $Command, $Directory, $Color)
    
    Write-Host "🔥 Starting $Name..." -ForegroundColor $Color
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Directory'; $Command" -WindowStyle Normal
    Start-Sleep 2
}

# Start MongoDB (if using local MongoDB)
Write-Host "📦 Starting MongoDB..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mongod --dbpath=./data/db" -WindowStyle Minimized

# Start ML Service
Start-Service "ML Service" "python main.py" "$PWD/ml" "Magenta"

# Start Backend Server
Start-Service "Backend Server" "npm run dev" "$PWD/server" "Yellow"

# Start Frontend Client
Start-Service "Frontend Client" "npm start" "$PWD/client" "Cyan"

Write-Host "🎉 All services starting!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:5000" -ForegroundColor Yellow  
Write-Host "🤖 ML API:   http://localhost:8000" -ForegroundColor Magenta
Write-Host "📊 MongoDB:  localhost:27017" -ForegroundColor Blue
Write-Host ""
Write-Host "Press any key to stop all services..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop all services
Get-Process | Where-Object {$_.ProcessName -eq "node" -or $_.ProcessName -eq "python" -or $_.ProcessName -eq "mongod"} | Stop-Process -Force
Write-Host "🛑 All services stopped." -ForegroundColor Red 