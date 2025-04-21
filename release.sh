#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Ensure a version argument is provided
if [ ! -f "version.json" ]; then
  echo "❌ Error: version.json not found."
  exit 1
fi

VERSION=$(grep '"version"' version.json | sed -E 's/[^0-9.]*([0-9.]+).*/\1/')

if [ -z "$VERSION" ] || [ "$VERSION" == "null" ]; then
  echo "❌ Error: Version not found in version.json."
  exit 1
fi

echo "🚀 Starting release process for version $VERSION..."

# Synchronize version across configuration files
npm run sync-version

echo "📦 Building the Expo application..."
npx expo export --output-dir dist

echo "📦 Building the Tauri application..."
npm run tauri:build

# Create a new Git tag for the release
if git rev-parse "$VERSION" >/dev/null 2>&1; then
  echo "❌ Git tag '$VERSION' already exists. Please bump the version in version.json."
  exit 1
fi

git add .
git commit -m "🔖 Release version $VERSION"
git tag -a "$VERSION" -m "Release $VERSION"
git push origin "$VERSION"

echo "🗂 Preparing release artifacts..."
rm -rf release
mkdir -p release
mv src-tauri/target/release/bundle/* release/
mv dist release/expo

# Create a GitHub release
gh release create "$VERSION" release/* --title "Release $VERSION" --notes "Automated release for version $VERSION"

echo "✅ Release $VERSION successfully created and published!"