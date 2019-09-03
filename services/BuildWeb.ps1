$webSourceLocation = '../web'
$webBuildFolder = 'fdl-web'

Push-Location $webSourceLocation

ng build --prod

if($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Pop-Location


if (Test-Path $webBuildFolder) {
    Remove-Item -Recurse -Force $webBuildFolder
}

Copy-Item "$webSourceLocation/dist/$webBuildFolder" -Recurse -Force