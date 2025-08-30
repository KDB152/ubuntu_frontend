# Script PowerShell pour exécuter le SQL de création de la table attendance

# Chemin vers MySQL (ajustez selon votre installation)
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"

# Vérifier si MySQL existe
if (Test-Path $mysqlPath) {
    Write-Host "MySQL trouvé à: $mysqlPath"
} else {
    Write-Host "MySQL non trouvé à: $mysqlPath"
    Write-Host "Veuillez ajuster le chemin dans le script"
    exit 1
}

# Lire le contenu du fichier SQL
$sqlContent = Get-Content "create-attendance-table.sql" -Raw

Write-Host "Exécution du script SQL..."
Write-Host "Contenu du script:"
Write-Host $sqlContent

# Exécuter le SQL
try {
    & $mysqlPath -u root -p chrono_carto -e $sqlContent
    Write-Host "✅ Script SQL exécuté avec succès!"
} catch {
    Write-Host "❌ Erreur lors de l'exécution du script SQL:"
    Write-Host $_.Exception.Message
}
