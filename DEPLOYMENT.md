
# YouthNet Deployment Guide

## Overview
This guide covers deploying YouthNet application with MongoDB backend and React frontend.

## Architecture
- **Frontend**: React + Vite (deployed via Lovable)
- **Backend**: Node.js + Express (deployed externally)
- **Database**: MongoDB Atlas (provided connection string)

## Step 1: Deploy Backend

### Recommended Platforms:
- **Railway** (easiest): railway.app
- **Render**: render.com
- **DigitalOcean App Platform**: digitalocean.com
- **Heroku**: heroku.com

### Backend Deployment Steps:

1. **Create account** on chosen platform
2. **Connect your repository** (if using Git-based deployment)
3. **Set environment variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://youthnet:R5406JQXc19Ss8Z3@db-mongodb-nyc3-34944-ffbfb8c2.mongo.ondigitalocean.com/youthnet?tls=true&authSource=admin&replicaSet=db-mongodb-nyc3-34944
   JWT_SECRET=your_secure_jwt_secret
   JWT_REFRESH_SECRET=your_secure_refresh_secret
   ALLOWED_ORIGINS=https://youthnet-nexus-dashboard.lovable.app
   PORT=5000
   ```
4. **Deploy the server** directory
5. **Note the deployed URL** (e.g., https://youthnet-api.railway.app)

### Railway Specific Instructions:
1. Go to railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `server`
5. Add environment variables in Railway dashboard
6. Deploy automatically happens

## Step 2: Update Frontend Configuration

1. **Update API URLs** in these files:
   - `src/config/auth.ts` - Change production URL
   - `src/lib/api.ts` - Change production URL
   - `src/lib/api-client.ts` - Change production URL

2. **Replace** `https://your-backend-domain.com` with your actual backend URL

## Step 3: Deploy Frontend via Lovable

1. **Click "Publish"** button in Lovable
2. **Copy the Lovable app URL** (e.g., https://youthnet-nexus-dashboard.lovable.app)
3. **Update backend CORS** settings with this URL

## Step 4: Update CORS Settings

Add your Lovable frontend URL to backend environment:
```
ALLOWED_ORIGINS=https://youthnet-nexus-dashboard.lovable.app
```

## Step 5: Test Deployment

1. **Visit your Lovable app URL**
2. **Test registration** and login
3. **Check browser console** for any errors
4. **Verify API calls** are reaching your backend

## Environment Variables Reference

### Backend (.env):
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://youthnet:R5406JQXc19Ss8Z3@db-mongodb-nyc3-34944-ffbfb8c2.mongo.ondigitalocean.com/youthnet?tls=true&authSource=admin&replicaSet=db-mongodb-nyc3-34944
JWT_SECRET=your_production_jwt_secret
JWT_REFRESH_SECRET=your_production_refresh_secret
ALLOWED_ORIGINS=https://youthnet-nexus-dashboard.lovable.app
PORT=5000
BCRYPT_SALT_ROUNDS=12
API_RATE_LIMIT=100
API_RATE_WINDOW=15
LOG_LEVEL=info
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Update ALLOWED_ORIGINS in backend
2. **API Not Found**: Check frontend API URLs match backend URL
3. **Auth Issues**: Verify JWT secrets are set
4. **Database Connection**: Confirm MongoDB URI is correct

### Logs:
- **Backend logs**: Check your hosting platform's logs
- **Frontend logs**: Check browser console
- **Database**: Monitor MongoDB Atlas logs

## Security Checklist

- ✅ Strong JWT secrets set
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ HTTPS enforced
- ✅ Environment variables secured
- ✅ Database connection encrypted

## Custom Domain (Optional)

### Frontend:
1. Go to Lovable Project Settings
2. Add custom domain
3. Configure DNS records

### Backend:
1. Configure custom domain on hosting platform
2. Update frontend API URLs
3. Update CORS settings

## Monitoring

### Recommended Tools:
- **Backend**: Platform-specific monitoring
- **Database**: MongoDB Atlas monitoring
- **Frontend**: Browser analytics
- **Uptime**: UptimeRobot or similar

## Cost Estimation

- **Backend Hosting**: $5-20/month
- **MongoDB**: Included (provided)
- **Frontend**: Free (Lovable)
- **Custom Domain**: $10-15/year (optional)

---

**Next Steps:**
1. Deploy backend to chosen platform
2. Update frontend URLs with backend URL
3. Deploy frontend via Lovable
4. Test full application
