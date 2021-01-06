echo "Starting build"

# Create deployment
npm run build

# Delete everything in folder
echo "Deleting target folder`s elements"

Get-ChildItem -Path '../xxpancakexx.github.io' -Recurse -exclude .git/ |
Select-Object -ExpandProperty FullName |
Remove-Item -Force -Recurse

# Copy new deployment to target folder
echo "Copying build to target folder"
cp -r "dist/*" "../xxpancakexx.github.io"

# Push to server
echo "Pushing data to server"
cd ../xxpancakexx.github.io
git add .
git commit -m "New Deployment"
git push