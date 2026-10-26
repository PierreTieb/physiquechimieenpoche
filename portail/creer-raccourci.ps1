# Crée sur le bureau un raccourci qui ouvre l'appli dans une fenêtre dédiée (Edge ou Chrome en mode appli).
# Lancé par « Créer le raccourci bureau.bat » : les chemins sont calculés depuis l'emplacement du dossier,
# donc ça marche quel que soit le PC ou l'endroit où le dossier a été copié.
$racine = Split-Path -Parent $PSScriptRoot
$page = ([System.Uri](Join-Path $racine 'index.html')).AbsoluteUri

$navigateurs = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LocalAppData\Google\Chrome\Application\chrome.exe"
)
$navigateur = $navigateurs | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1

$bureau = [Environment]::GetFolderPath('Desktop')
$lnk = (New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path $bureau 'Physique Chimie en Poche.lnk'))
if ($navigateur) {
  $lnk.TargetPath = $navigateur
  $lnk.Arguments = "--app=`"$page`" --start-maximized"
} else {
  # Ni Edge ni Chrome : on ouvre la page dans le navigateur par défaut
  $lnk.TargetPath = Join-Path $racine 'index.html'
}
$lnk.WorkingDirectory = $racine
$lnk.IconLocation = (Join-Path $racine 'portail\icone-arrondie.ico') + ',0'
$lnk.Description = 'Physique Chimie en Poche'
$lnk.Save()

Write-Host "Raccourci créé sur le bureau : $bureau"
