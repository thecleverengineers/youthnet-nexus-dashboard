# YouthNet MongoDB Migration Guide

## 🎯 Overview

This guide documents the complete transformation of YouthNet from a demo Supabase application to a production-ready MongoDB application with Digital Ocean's managed database.

## 🚀 What's Implemented

### ✅ Phase 1: Backend Infrastructure (COMPLETED)
- **MongoDB Connection**: Connected to Digital Ocean managed MongoDB cluster
- **Authentication System**: Complete JWT-based auth with bcrypt password hashing
- **API Framework**: Express.js server with security middleware (helmet, CORS, rate limiting)
- **Database Models**: Mongoose schemas for Users, Students, Trainers, Employees
- **Dual Auth System**: Seamless switching between Supabase and MongoDB auth

### 🔧 Architecture

```
Frontend (React + TypeScript)
├── Auth Provider Switch (src/config/auth.ts)
├── MongoDB Auth Hook (src/hooks/useMongoAuth.tsx)
├── API Client (src/lib/api.ts)
└── Existing Supabase Integration (preserved)

Backend (Node.js + Express)
├── MongoDB Models (server/models/)
├── JWT Authentication (server/middleware/auth.js)
├── API Routes (server/routes/)
└── Security Middleware
```

## 🛠️ Setup Instructions

### 1. Start MongoDB Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Configure Auth Provider

In `src/config/auth.ts`, change the provider:

```typescript
export const authConfig = {
  provider: 'mongodb' as AuthProvider, // Change to 'supabase' to switch back
  // ...
}
```

### 3. Database Connection

The app connects to your Digital Ocean MongoDB cluster:
```
Host: mongodb+srv://db-mongodb-nyc3-34944-ffbfb8c2.mongo.ondigitalocean.com
Database: admin
User: doadmin
```

## 🔐 Authentication Features

### Current MongoDB Auth Features:
- ✅ User Registration with role-based account creation
- ✅ Email/Password Login with JWT tokens
- ✅ Token refresh mechanism
- ✅ Role-based access control (admin, staff, trainer, student)
- ✅ Secure password hashing with bcrypt
- ✅ Profile management
- ✅ Automatic role-specific record creation

### Security Features:
- ✅ Rate limiting on auth endpoints
- ✅ JWT with expiration and refresh tokens
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation and sanitization

## 📊 Database Schema

### Users Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  profile: {
    fullName: String,
    phone: String,
    role: 'admin' | 'staff' | 'trainer' | 'student'
  },
  isEmailVerified: Boolean,
  status: 'active' | 'inactive' | 'suspended',
  timestamps
}
```

### Role-Specific Collections
- **Students**: Academic info, enrollment data, emergency contacts
- **Trainers**: Specializations, certifications, performance metrics
- **Employees**: HR data, compensation, department info

## 🔄 Migration Status

### ✅ Completed:
1. **Backend Infrastructure**: Complete Express.js API with MongoDB
2. **Authentication System**: Full JWT implementation
3. **User Management**: Registration, login, profile management
4. **Database Models**: Core user and role models
5. **Security**: Production-ready security middleware
6. **Dual Auth**: Seamless switching between auth providers

### 🚧 Next Steps (Choose Your Module):

#### Option A: Student Management System
- Course enrollments and progress tracking
- Academic performance analytics
- Skill assessments and certifications

#### Option B: HR & Employee Management
- Attendance tracking and payroll
- Performance reviews and task management
- Employee benefits and training

#### Option C: Training & Education
- Course management and scheduling
- Trainer assignments and resources
- Learning progress tracking

#### Option D: Job Center & Placements
- Job posting management
- Application tracking system
- Employer relationship management

## 🧪 Testing the System

### Test the MongoDB Auth:

1. **Registration**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "role": "student"
  }'
```

2. **Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

3. **Profile Access**:
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Configuration Options

### Switch Back to Supabase
Change `src/config/auth.ts`:
```typescript
provider: 'supabase' as AuthProvider
```

### Production Environment Variables
```env
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret
MONGODB_URI=your_mongodb_connection_string
EMAIL_SERVICE_API_KEY=your_email_service_key
```

## 📈 Performance Features

- **Database Indexing**: Optimized queries with proper MongoDB indexes
- **Connection Pooling**: Efficient database connection management
- **Caching**: Built-in request caching with proper cache headers
- **Rate Limiting**: API protection against abuse

## 🛡️ Security Features

- **JWT with Refresh Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Proper cross-origin resource sharing
- **Helmet.js**: Security headers for production
- **Input Validation**: Comprehensive request validation

---

## 🎯 Ready for Production

The current implementation provides a solid foundation for a production application with:
- Secure authentication and authorization
- Scalable database architecture
- Professional API design
- Security best practices
- Easy maintenance and extension

**Which module would you like me to implement next?**