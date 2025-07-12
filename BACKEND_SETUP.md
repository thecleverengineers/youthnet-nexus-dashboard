
# YouthNet Backend Setup Guide

## Quick Start for Development

### Prerequisites
- Node.js 18 or higher
- MongoDB connection (already configured in the project)

### Starting the Backend Server

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

4. **Verify the server is running:**
   - Open http://localhost:5000/health in your browser
   - You should see a JSON response indicating the server is healthy

### Environment Configuration

The server uses these environment variables (already configured):
- `NODE_ENV`: development/production
- `PORT`: 5000 (default)
- `MONGODB_URI`: Pre-configured MongoDB Atlas connection
- `JWT_SECRET`: Authentication secret key
- `ALLOWED_ORIGINS`: CORS configuration for frontend

### API Endpoints

- **Health Check:** `GET /health`
- **Authentication:** 
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/profile`
- **Dashboard:** `GET /api/dashboard`

### Troubleshooting

1. **Port 5000 already in use:**
   ```bash
   lsof -ti:5000 | xargs kill -9
   ```

2. **MongoDB connection issues:**
   - Check if the MongoDB URI is correct in the environment variables
   - Ensure network connectivity

3. **CORS errors:**
   - Verify `ALLOWED_ORIGINS` includes your frontend URL
   - Check that the frontend is making requests to `http://localhost:5000`

### Frontend Integration

The frontend is configured to connect to:
- **Development:** `http://localhost:5000`
- **Production:** Your deployed backend URL

Make sure the backend server is running before starting the frontend application.

### Production Deployment

For production deployment, refer to:
- `server/DEPLOYMENT.md` - Comprehensive deployment guide
- `server/deploy-droplet.sh` - DigitalOcean deployment script
- `server/Dockerfile` - Docker containerization

### Monitoring

Use these commands to monitor the backend:
- `pm2 status` - Check PM2 process status
- `pm2 logs youthnet-api` - View application logs
- `pm2 restart youthnet-api` - Restart the application

The YouthNet API (youthnet-api) is the PM2 process name for the backend service.
