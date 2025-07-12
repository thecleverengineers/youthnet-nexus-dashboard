
#!/bin/bash

echo "🚀 YouthNet Backend - GitHub Deployment"
echo "======================================"

# Check if we're in the correct directory
if [ ! -f "server/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Make sure you have a 'server' directory with package.json"
    exit 1
fi

# Navigate to server directory
cd server

echo "📁 Initializing Git repository..."
git init

echo "📝 Setting up .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Uploads directory
uploads/
temp/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOF

echo "📦 Adding files to Git..."
git add .

echo "💾 Creating initial commit..."
git commit -m "Initial commit: YouthNet Backend API

Features:
- Express.js server with MongoDB Atlas integration
- JWT authentication system with refresh tokens
- Role-based access control (student, trainer, staff, admin)
- Security middleware (helmet, CORS, rate limiting)
- Production-ready configuration for DigitalOcean
- Docker support for containerized deployment
- Comprehensive API documentation"

echo "🔗 Adding GitHub remote repository..."
git remote add origin https://github.com/thecleverengineers/youthnet-backend.git

echo "⬆️ Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Backend uploaded to GitHub successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Visit: https://github.com/thecleverengineers/youthnet-backend"
echo "2. Verify your code is uploaded correctly"
echo "3. Create your DigitalOcean Droplet"
echo "4. Run the droplet deployment script"
echo ""
echo "🌐 Repository URL: https://github.com/thecleverengineers/youthnet-backend"
