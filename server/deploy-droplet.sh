
#!/bin/bash

# DigitalOcean Droplet Deployment Script
# Run this script on your DigitalOcean droplet after SSH connection

echo "🌊 YouthNet Backend - DigitalOcean Droplet Setup"
echo "=============================================="

# Update system
echo "🔄 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
echo "⚡ Installing PM2..."
sudo npm install -g pm2

# Install Git, Nginx, and other utilities
echo "🛠️ Installing additional tools..."
sudo apt install git nginx ufw htop -y

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Navigate to web directory
cd /var/www

# Clone repository
echo "📥 Cloning YouthNet backend..."
sudo git clone https://github.com/thecleverengineers/youthnet-nexus-dashboard.git

# Set permissions
sudo chown -R $USER:$USER /var/www/youthnet-nexus-dashboard
cd youthnet-nexus-dashboard

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create production environment file
echo "⚙️ Creating production environment file..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://youthnet:R5406JQXc19Ss8Z3@db-mongodb-nyc3-34944-ffbfb8c2.mongo.ondigitalocean.com/youthnet?tls=true&authSource=admin&replicaSet=db-mongodb-nyc3-34944
JWT_SECRET=YN2024_Kp9mV$2nL8qW#6xR4jF!7zH3sA5tB9cE1uY&8oM*0iN+3vG^6dS@7eP4wQ!2lX5mZ8
JWT_REFRESH_SECRET=YN2024_Zx8C#4vB1nM&9qE!6rT*3yU@7iO^5pA+2sD$0fG#8hJ!1kL&4mN*7bV^9cX@3eWfR6
ALLOWED_ORIGINS=https://youthnet-nexus-dashboard.lovable.app
BCRYPT_SALT_ROUNDS=12
API_RATE_LIMIT=100
API_RATE_WINDOW=15
LOG_LEVEL=info
SESSION_SECRET=YN2024_Mn7B#3xF!9qW@2eR^6tY&8uI*1oP+5aS$4dG#7hJ!0kL^3zX&6cV*9bN@2mQ#5tG4
EOF

echo "🔒 Setting secure permissions for environment file..."
chmod 600 .env

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start app.js --name "youthnet-api"
pm2 save
pm2 startup

# Configure Nginx
echo "🌐 Configuring Nginx reverse proxy..."
sudo tee /etc/nginx/sites-available/youthnet-api > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/youthnet-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx

# Create deployment script for updates
echo "📄 Creating update deployment script..."
cat > /var/www/update-deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/youthnet-nexus-dashboard
git pull origin main
npm install --production
pm2 restart youthnet-api
echo "✅ Deployment updated successfully!"
EOF

chmod +x /var/www/update-deploy.sh

echo ""
echo "✅ DigitalOcean Droplet setup completed successfully!"
echo ""
echo "📋 Your YouthNet API is now running:"
echo "   🌐 API URL: http://$(curl -s http://checkip.amazonaws.com)/health"
echo "   📊 PM2 Status: pm2 status"
echo "   📝 View Logs: pm2 logs youthnet-api"
echo "   🔄 Update: /var/www/update-deploy.sh"
echo ""
echo "🎉 Ready to connect your Lovable frontend!"
