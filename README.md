
# YouthNet - Complete Full-Stack Application

YouthNet is a comprehensive platform for managing youth development programs, education, career services, and community initiatives in Nagaland.

## Architecture Overview

### Frontend (Lovable)
- **Technology**: React + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Zustand
- **Authentication**: JWT-based with refresh tokens
- **Deployment**: Lovable platform (auto-deployed)

### Backend (DigitalOcean)  
- **Technology**: Node.js + Express.js
- **Database**: MongoDB Atlas (DigitalOcean managed)
- **Authentication**: JWT with bcrypt password hashing
- **Security**: Helmet, CORS, Rate limiting
- **Deployment**: DigitalOcean Droplet with PM2 + Nginx

## Quick Start

### 1. Deploy Backend to GitHub & DigitalOcean

From this Lovable project:

```bash
# Upload backend to GitHub
chmod +x deploy-to-github.sh
./deploy-to-github.sh
```

Then on your DigitalOcean droplet:

```bash
# Deploy to droplet
curl -sSL https://raw.githubusercontent.com/thecleverengineers/youthnet-backend/main/deploy-droplet.sh | bash
```

### 2. Update Frontend Configuration

After backend deployment, update these files with your droplet IP:

- `src/config/auth.ts`
- `src/lib/api.ts` 
- `src/lib/api-client.ts`

Replace `https://your-backend-domain.com` with `http://your_droplet_ip`

### 3. Deploy Frontend

Click **"Publish"** in Lovable to deploy your frontend.

## Features

### 🎓 Education Management
- Course enrollment and management
- Student progress tracking
- Instructor assignment
- Performance analytics

### 👥 HR & Administration
- Employee management system
- Payroll processing
- Attendance tracking
- Performance reviews
- Task management

### 💼 Career Centre
- Job posting and application tracking
- Career counselling
- Mentorship programs
- Placement analytics

### 🚀 Incubation Hub
- Startup application processing
- Project management
- Funding tracking
- Mentor assignment

### 🛍️ Made in Nagaland
- Local product catalog
- Producer management
- Certification tracking
- Marketplace analytics

### 📊 Analytics & Reporting
- Comprehensive dashboard
- Custom report generation
- Data export capabilities
- Real-time analytics

## User Roles

- **Students**: Access courses, track progress, apply for jobs
- **Trainers**: Manage courses, track student performance
- **Staff**: Administrative functions, HR management
- **Admin**: Full system access, user management, reports

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui component library
- React Query for data fetching
- React Router for navigation
- Zustand for state management

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing
- Helmet for security headers
- CORS for cross-origin requests
- Express rate limiting

### Infrastructure
- **Frontend**: Lovable platform
- **Backend**: DigitalOcean Droplet
- **Database**: MongoDB Atlas (DigitalOcean)
- **Process Manager**: PM2
- **Web Server**: Nginx (reverse proxy)

## Environment Setup

### Backend Environment Variables
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
ALLOWED_ORIGINS=https://your-lovable-app.lovable.app
```

### Frontend Environment
Configured automatically in Lovable with API endpoints pointing to your backend.

## Deployment URLs

- **Frontend**: `https://your-app.lovable.app`
- **Backend**: `http://your-droplet-ip:5000`
- **API Health**: `http://your-droplet-ip:5000/health`

## Development Workflow

1. **Frontend Development**: Use Lovable editor for UI/UX changes
2. **Backend Changes**: Update code, push to GitHub, run update script on droplet
3. **Testing**: Use Lovable preview for frontend, Postman/curl for API testing
4. **Deployment**: Automatic for frontend via Lovable, manual for backend via SSH

## Monitoring & Maintenance

### Backend Monitoring
```bash
# Check application status
pm2 status

# View logs
pm2 logs youthnet-api

# Monitor system resources
htop

# Update deployment
/var/www/update-deploy.sh
```

### Frontend Monitoring
- Use Lovable's built-in analytics
- Monitor via browser console
- Check for runtime errors in production

## Cost Breakdown

- **Frontend Hosting**: Free (Lovable)
- **Backend Hosting**: $6/month (DigitalOcean Droplet)
- **Database**: Free (provided MongoDB Atlas)
- **Domain** (optional): $10-15/year
- **SSL Certificate**: Free (Let's Encrypt)

**Total**: ~$6/month + domain cost

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Security headers via Helmet
- Input validation and sanitization
- Role-based access control

## Support & Documentation

- **Backend Repository**: https://github.com/thecleverengineers/youthnet-backend
- **Deployment Guide**: `server/DEPLOYMENT.md`
- **API Documentation**: Available at `/health` endpoint
- **Frontend Documentation**: This README

## License

MIT License - See LICENSE file for details.

---

**YouthNet Platform - Empowering Youth Development in Nagaland 🚀**
