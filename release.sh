#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Ensure a version argument is provided
if [ -z "$1" ]; then
  echo "❌ Error: No version provided. Usage: ./release.sh <version>"
  exit 1
fi

VERSION=$1

echo "🚀 Starting release process for version $VERSION..."

# Synchronize version across configuration files
npm run sync-version

echo "📦 Building the Tauri application..."
cd src-tauri && cargo tauri build
cd ..

echo "📦 Building the Expo application..."
npx expo export --output-dir dist

# Create a new Git tag for the release
git add .
git commit -m "🔖 Release version $VERSION"
git tag -a "$VERSION" -m "Release $VERSION"
git push origin "$VERSION"

echo "🗂 Preparing release artifacts..."
mkdir -p release
mv src-tauri/target/release/bundle/* release/
mv dist release/expo

# Create a GitHub release
gh release create "$VERSION" release/* --title "Release $VERSION" --notes "Automated release for version $VERSION"

echo "✅ Release $VERSION successfully created and published!"