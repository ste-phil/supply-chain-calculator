echo "Starting build"

# Create deployment
npm run build

# Delete everything in folder
echo "Deleting target folder`s elements"

Get-ChildItem -Path '../scc-demo' -Recurse -exclude .git/ |
Select-Object -ExpandProperty FullName |
Remove-Item -Force -Recurse

# Copy new deployment to target folder
echo "Copying build to target folder"
cp -r "dist/*" "../scc-demo"

# Push to server
echo "Pushing data to server"
cd ../scc-demo

git add .
git commit -m "New Deployment"
git push

# Go back to directory
cd "../supply-chain-calculator"