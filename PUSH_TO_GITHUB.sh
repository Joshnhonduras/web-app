#!/bin/bash
# One-time setup to push to GitHub

echo "🚀 Pushing Growth Hub to GitHub..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Set remote
git remote add origin https://github.com/joshnhonduras/growth-hub.git

# Rename branch to main
git branch -M main

# Initial commit
git commit -m "Initial commit - Growth Hub PWA with AI chat, voice features, and dynamic model selector"

# Push
echo "Pushing to GitHub..."
git push -u origin main

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Done! Your code is now on GitHub"
echo "📦 Repository: https://github.com/joshnhonduras/growth-hub"
echo ""
echo "From now on, just run: ./auto-git.sh \"your message\""
