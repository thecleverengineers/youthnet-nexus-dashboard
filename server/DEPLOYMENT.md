
# YouthNet Backend Deployment Guide

## Quick Start - Upload to GitHub from Lovable

### Prerequisites
- GitHub repository: `https://github.com/thecleverengineers/youthnet-backend`
- Git configured in your Lovable environment

### Step 1: Run Deployment Script
From your Lovable project root directory:

```bash
chmod +x deploy-to-github.sh
./deploy-to-github.sh
```

This script will:
- Initialize Git repository in the `server` directory
- Create proper `.gitignore` file
- Add all backend files to Git
- Commit with descriptive message
- Push to GitHub repository

### Step 2: Verify Upload
Visit https://github.com/thecleverengineers/youthnet-backend to confirm your code is uploaded.

## DigitalOcean Droplet Deployment

### Step 1: Create Droplet
1. **DigitalOcean Console** → Create → Droplets
2. **Image**: Ubuntu 22.04 LTS
3. **Size**: Basic $6/month (1GB RAM, 1 vCPU)
4. **Authentication**: Add SSH key
5. **Create droplet**

### Step 2: Deploy to Droplet
SSH into your droplet and run:

```bash
curl -sSL https://raw.githubusercontent.com/thecleverengineers/youthnet-backend/main/deploy-droplet.sh | bash
```

Or manually:

```bash
ssh root@your_droplet_ip
wget https://raw.githubusercontent.com/thecleverengineers/youthnet-backend/main/deploy-droplet.sh
chmod +x deploy-droplet.sh
./deploy-droplet.sh
```

### Step 3: Test Deployment
```bash
# Check API health
curl http://your_droplet_ip/health

# Check PM2 status
pm2 status

# View logs
pm2 logs youthnet-api
```

### Step 4: Update Frontend Configuration
In your Lovable project, update API URLs to:
```
http://your_droplet_ip
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Health Check
- `GET /health` - API health status

## Environment Variables

### Required for Production
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_REFRESH_SECRET=your_secure_refresh_secret
ALLOWED_ORIGINS=https://youthnet-nexus-dashboard.lovable.app
```

## Maintenance Commands

```bash
# Update deployment
/var/www/update-deploy.sh

# View application logs
pm2 logs youthnet-api

# Restart application
pm2 restart youthnet-api

# Check system resources
htop

# Check disk space
df -h
```

## Troubleshooting

### Common Issues

1. **Port 5000 not accessible**
   ```bash
   sudo ufw allow 5000
   sudo systemctl restart nginx
   ```

2. **MongoDB connection issues**
   - Verify `MONGODB_URI` in `.env`
   - Check network connectivity

3. **PM2 not starting on boot**
   ```bash
   pm2 startup
   # Follow the generated command
   pm2 save
   ```

### Logs Location
- **Application logs**: `pm2 logs youthnet-api`
- **Nginx logs**: `/var/log/nginx/`
- **System logs**: `journalctl -u nginx`

## Security Checklist

- ✅ Strong JWT secrets configured
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Firewall configured (UFW)
- ✅ Environment variables secured
- ✅ MongoDB connection encrypted

## Cost Estimation

- **DigitalOcean Droplet**: $6/month (Basic)
- **MongoDB Atlas**: Free (provided connection)
- **Total**: ~$6/month

## Support

For issues or questions:
- Check the GitHub repository
- Review the deployment logs
- Verify environment configuration

---

**Your YouthNet Backend is now production-ready! 🚀**
