#!/bin/bash
# Auto Git Push Script
# Just run: ./auto-git.sh "your commit message"
# Or: ./auto-git.sh (uses default message)

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get commit message or use default
COMMIT_MSG="${1:-Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')}"

echo -e "${BLUE}🔄 Auto Git Push${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if git repo exists
if [ ! -d .git ]; then
    echo -e "${RED}❌ Not a git repository!${NC}"
    echo "Run './auto-git.sh init' to initialize"
    exit 1
fi

# Stage all changes
echo -e "${BLUE}📦 Staging changes...${NC}"
git add .

# Check if there are changes
if git diff --staged --quiet; then
    echo -e "${GREEN}✓ No changes to commit${NC}"
    exit 0
fi

# Commit
echo -e "${BLUE}💾 Committing: ${COMMIT_MSG}${NC}"
git commit -m "$COMMIT_MSG"

# Push
echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
git push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Successfully pushed to GitHub!${NC}"
else
    echo -e "${RED}❌ Push failed. Check your credentials.${NC}"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Done!${NC}"
