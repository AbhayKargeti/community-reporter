# 🚀 Push to GitHub - Step by Step Guide

Follow these steps to push your Community Reporter project to GitHub.

## Step 1: Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `community-reporter` (or any name you prefer)
   - **Description**: "Laravel + React community reporting system with admin dashboard"
   - **Visibility**: Choose Public or Private
   - ⚠️ **DO NOT** check "Initialize this repository with a README" (we already have one)
   - ⚠️ **DO NOT** add .gitignore or license (we already have them)
5. Click **"Create repository"**

## Step 2: Link Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/AbhayKargeti/community-reporter.git

# Verify the remote was added
git remote -v
```

## Step 3: Push Your Code to GitHub

```bash
# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

If prompted for credentials:
- **Username**: AbhayKargeti
- **Password**: Use a Personal Access Token (not your GitHub password)

### 🔑 How to Create a Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Community Reporter"
4. Select scopes: ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing

## Step 4: Verify Your Code is on GitHub

1. Go to your repository URL: `https://github.com/AbhayKargeti/community-reporter`
2. You should see all your files listed
3. The README.md will be displayed on the main page

## 🔄 Working from Multiple Machines

### On a New Machine:

```bash
# Clone the repository
git clone https://github.com/AbhayKargeti/community-reporter.git
cd community-reporter

# Install dependencies
composer install
npm install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Configure your database in .env file
# Then run migrations
php artisan migrate:fresh --seed

# Create storage link
php artisan storage:link

# Start development servers
php artisan serve
# In another terminal:
npm run dev
```

### Making Changes:

```bash
# 1. Pull latest changes before starting work
git pull origin main

# 2. Create a new branch for your feature
git checkout -b feature/your-feature-name

# 3. Make your changes...

# 4. Stage and commit your changes
git add .
git commit -m "Add: description of your changes"

# 5. Push your branch to GitHub
git push origin feature/your-feature-name

# 6. Create a Pull Request on GitHub
# Then merge it to main branch
```

### Daily Workflow:

```bash
# Start of day: Pull latest changes
git pull origin main

# End of day: Push your changes
git add .
git commit -m "Add: today's work description"
git push origin main
```

## 📋 Quick Reference Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Create a new branch
git checkout -b branch-name

# Switch branches
git checkout branch-name

# List all branches
git branch -a

# Pull latest changes
git pull origin main

# Push changes
git push origin branch-name

# Discard local changes
git restore .

# View remote repository
git remote -v
```

## ⚠️ Important Notes

1. **Never commit `.env` file** - It's already in .gitignore
2. **Never commit `node_modules/`** - It's already in .gitignore
3. **Never commit `vendor/`** - It's already in .gitignore
4. **Always pull before pushing** to avoid conflicts
5. **Write clear commit messages** to track changes easily

## 🔒 Security Checklist

- ✅ `.env` file is in .gitignore
- ✅ Database credentials are not committed
- ✅ API keys and secrets are not committed
- ✅ Using Personal Access Token for authentication

## 🆘 Common Issues

### Issue: "Permission denied (publickey)"
**Solution**: Use HTTPS URL instead of SSH, or set up SSH keys

### Issue: "Failed to push some refs"
**Solution**: Pull first with `git pull origin main --rebase`

### Issue: "Conflict"
**Solution**: 
```bash
git status  # See conflicted files
# Edit files to resolve conflicts
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

### Issue: Large file error
**Solution**: Check if you accidentally committed `node_modules/` or `vendor/`

## 📞 Need Help?

- Git Documentation: https://git-scm.com/doc
- GitHub Docs: https://docs.github.com
- GitHub Support: https://support.github.com

---

Your repository URL will be: **https://github.com/AbhayKargeti/community-reporter**
