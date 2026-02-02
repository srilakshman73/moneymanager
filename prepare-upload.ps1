$source = "d:\hackthon hcl"
$dest = "d:\hackthon hcl\money-manager-upload"
$zip = "d:\hackthon hcl\project-upload.zip"

Write-Host "Preparing project for upload..."

# 1. Create Clean Temp Directory
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# 2. Copy Backend (Skipping node_modules and .mongo-bin)
Write-Host "Copying Backend..."
New-Item -ItemType Directory -Force -Path "$dest\money-manager-backend" | Out-Null
Get-ChildItem -Path "$source\money-manager-backend" -Exclude "node_modules",".mongo-bin",".env" | Copy-Item -Destination "$dest\money-manager-backend" -Recurse

# 3. Copy Frontend (Skipping node_modules and dist)
Write-Host "Copying Frontend..."
New-Item -ItemType Directory -Force -Path "$dest\money-manager-frontend" | Out-Null
Get-ChildItem -Path "$source\money-manager-frontend" -Exclude "node_modules","dist" | Copy-Item -Destination "$dest\money-manager-frontend" -Recurse

# 4. Copy Root Files
Copy-Item -Path "$source\package.json" -Destination $dest
Copy-Item -Path "$source\start-app.bat" -Destination $dest
if (Test-Path "$source\.gitignore") { Copy-Item -Path "$source\.gitignore" -Destination $dest }
if (Test-Path "$source\README.md") { Copy-Item -Path "$source\README.md" -Destination $dest }

# 5. Zip It
Write-Host "Creating ZIP file..."
if (Test-Path $zip) { Remove-Item $zip }
Compress-Archive -Path "$dest\*" -DestinationPath $zip

# 6. Cleanup
Remove-Item -Path $dest -Recurse -Force

Write-Host "SUCCESS: ZIP created at $zip"
