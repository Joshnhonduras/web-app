# Super Easy GitHub Setup

## You Only Need to Do This ONCE:

### Step 1: Create GitHub Repo (Web Interface - Easy!)
1. Go to https://github.com/new
2. Repository name: `growth-hub`
3. Make it Private (or Public, your choice)
4. **DON'T** initialize with README (we already have code)
5. Click "Create repository"
6. Copy the URL (looks like: `https://github.com/yourusername/growth-hub.git`)

### Step 2: Connect Your Local Code (Run Once)
```bash
cd /mnt/hdd/growth_hub/web-app
git remote add origin https://github.com/YOURUSERNAME/growth-hub.git
git branch -M main
git commit -m "Initial commit - Growth Hub PWA"
git push -u origin main
```

Done! Your code is on GitHub!

---

## From Now On - Super Simple:

### Every Time You Want to Save/Push:

**Option 1: Use the auto-git script (Easiest)**
```bash
./auto-git.sh "what you changed"
```
Examples:
```bash
./auto-git.sh "added voice chat"
./auto-git.sh "fixed model selector"
./auto-git.sh  # auto-generates message with timestamp
```

**Option 2: Manual (if you want)**
```bash
git add .
git commit -m "your message"
git push
```

---

## Universal Auto-Git Script (Copy to Any Project)

I created `auto-git.sh` - just copy this file to any project folder and use it!

**Features:**
- ✅ Auto-stages all changes
- ✅ Auto-commits with your message (or timestamp)
- ✅ Auto-pushes to GitHub
- ✅ Shows you what happened
- ✅ Works in any git project

**Copy to other projects:**
```bash
cp /mnt/hdd/growth_hub/web-app/auto-git.sh /path/to/other/project/
cd /path/to/other/project
./auto-git.sh "my changes"
```

---

## What You Need to Provide Me:

Just your **GitHub username** so I can show you the exact commands with your real URL!

Or you can:
1. Create the repo on GitHub (takes 30 seconds)
2. Copy the URL they give you
3. Run the commands above with your URL
4. Done!

Then just use `./auto-git.sh` every time you want to save!
