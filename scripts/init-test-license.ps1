# Script d'initialisation de licence de test pour Windows

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  INITIALISATION LICENCE DE TEST" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "..\backend"

Push-Location $backendDir

try {
    # Vérifier que Prisma est configuré
    if (-not (Test-Path "prisma\schema.prisma")) {
        Write-Host "❌ Schema Prisma non trouvé" -ForegroundColor Red
        exit 1
    }

    # Vérifier que la base de données est accessible
    Write-Host "🔍 Vérification de la base de données..." -ForegroundColor Yellow
    $dbCheck = & npm run prisma:status 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Base de données non accessible, tentative de migration..." -ForegroundColor Yellow
        & npm run prisma:migrate
    }

    # Exécuter le script d'initialisation de licence
    Write-Host "🚀 Génération de la licence de test..." -ForegroundColor Green
    & node scripts/init-test-license.js generate

    Write-Host ""
    Write-Host "✅ Initialisation terminée !" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Pour utiliser la licence :" -ForegroundColor Cyan
    Write-Host "   1. Ouvrez http://localhost:5173/" -ForegroundColor White
    Write-Host "   2. Cliquez sur 'Utiliser la licence de test'" -ForegroundColor White
    Write-Host "   3. Ou copiez la clé affichée ci-dessus" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host "❌ Erreur lors de l'initialisation : $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
finally {
    Pop-Location
}
