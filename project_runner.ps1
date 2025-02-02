
# project_runner.ps1

# Ensure you have Go, Docker, and Flutter installed before proceeding.
# This script sets up and runs the project locally.

# Step 1: Run the Go server
Write-Host "Starting the Go server..."
go run cmd/server/main.go

# Step 2: Build the Flutter app for mobile/web
Write-Host "Building the Flutter app..."
flutter build web  # or flutter build apk for mobile

# Step 3: Run Docker container
Write-Host "Running Docker container..."
docker-compose up -d

Write-Host "Project is now running locally!"
