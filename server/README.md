
# YouthNet Backend API

A comprehensive backend API for the YouthNet platform built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **Role-Based Access Control**: Support for students, trainers, staff, and admin roles
- **MongoDB Integration**: Using MongoDB Atlas with DigitalOcean
- **Security**: Rate limiting, CORS, helmet protection
- **Error Handling**: Comprehensive error handling and logging

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Health Check
- `GET /health` - API health status

## Installation

### Prerequisites
- Node.js 16+ 
- MongoDB Atlas account (provided)
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/thecleverengineers/youthnet-nexus-dashboard.git
cd youthnet-nexus-dashboard/server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | `your-refresh-secret` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://app.com,https://admin.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `12` |
| `API_RATE_LIMIT` | Requests per window | `100` |
| `API_RATE_WINDOW` | Rate limit window (minutes) | `15` |
| `LOG_LEVEL` | Logging level | `info` |

## Production Deployment

### Using Docker

1. Build the Docker image:
```bash
docker build -t youthnet-nexus-dashboard .
```

2. Run the container:
```bash
docker run -p 5000:5000 --env-file .env.production youthnet-nexus-dashboard
```

### Using DigitalOcean App Platform

1. Connect your GitHub repository
2. Set the root directory to `server`
3. Configure environment variables in the App Platform dashboard
4. Deploy automatically

### Environment Configuration

For production deployment, ensure these variables are set:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://youthnet:R5406JQXc19Ss8Z3@db-mongodb-nyc3-34944-ffbfb8c2.mongo.ondigitalocean.com/youthnet?tls=true&authSource=admin&replicaSet=db-mongodb-nyc3-34944
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
ALLOWED_ORIGINS=https://your-frontend-domain.lovable.app
```

## Database

The application uses MongoDB Atlas hosted on DigitalOcean with the following collections:

- `users` - User accounts and profiles
- `students` - Student-specific data
- `trainers` - Trainer-specific data  
- `employees` - Employee-specific data
- `training_programs` - Training program management
- `courses` - Course management
- `enrollments` - Student enrollments
- `attendance` - Attendance tracking
- `payroll` - Payroll management
- `inventory` - Asset management
- `reports` - System reports

## Security Features

- **Helmet**: Security headers protection
- **CORS**: Cross-origin request control
- **Rate Limiting**: API request throttling
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Request data validation
- **Environment Variables**: Secure configuration management

## Monitoring and Logging

- Request/response logging
- Error tracking and reporting
- Performance monitoring
- Health check endpoint for uptime monitoring

## API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    // Detailed error information
  }
}
```

## Development Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run create:admin` - Create admin user
- `npm run import:data` - Import sample data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions, please contact the YouthNet development team.

## License

This project is licensed under the MIT License.
