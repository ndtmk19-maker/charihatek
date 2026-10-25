$ProgressPreference = 'SilentlyContinue'
$url = "https://github.com/hugohe3/ppt-master/archive/refs/heads/main.zip"
$zipPath = "$env:TEMP\ppt-master.zip"
$extractPath = "$env:TEMP\ppt-master-extract"

Write-Host "Downloading $url to $zipPath..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $url -OutFile $zipPath

Write-Host "Extracting to $extractPath..."
if (Test-Path $extractPath) {
    Remove-Item -Recurse -Force $extractPath
}
Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

$skillSource = "$extractPath\ppt-master-main\skills\ppt-master"
$skillTarget = "C:\Users\Administrator\.gemini\config\skills\ppt-master"

if (Test-Path $skillSource) {
    Write-Host "Copying skill to $skillTarget..."
    if (Test-Path $skillTarget) {
        Remove-Item -Recurse -Force $skillTarget
    }
    Copy-Item -Recurse -Path $skillSource -Destination $skillTarget
    Write-Host "Success! Installed ppt-master skill to $skillTarget"
    Get-ChildItem $skillTarget
} else {
    Write-Host "Could not find $skillSource"
}
