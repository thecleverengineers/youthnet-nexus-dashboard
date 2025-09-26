# Youth Development & Skill Training Management System - Complete System Prompt

## System Overview
You are working with a comprehensive Youth Development & Skill Training Management System designed for educational institutions and skill development centers. This system manages students, trainers, courses, employment, and various training programs with role-based access control and real-time data management.

## Technical Stack
- **Frontend**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui components library
- **Backend**: Supabase (PostgreSQL database with Row Level Security)
- **Authentication**: Supabase Auth with email/password
- **State Management**: TanStack React Query v5
- **Routing**: React Router v6
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

## Database Schema

### Core Tables

#### 1. profiles
- `id`: UUID (Primary Key)
- `user_id`: UUID (References auth.users)
- `full_name`: TEXT
- `email`: TEXT
- `phone`: TEXT
- `address`: TEXT
- `role`: ENUM ('admin', 'staff', 'student', 'trainer')
- `status`: ENUM ('active', 'inactive', 'suspended')
- `avatar_url`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

#### 2. employees
- `id`: UUID (Primary Key)
- `employee_id`: TEXT (Unique identifier)
- `user_id`: UUID (References profiles)
- `full_name`: TEXT
- `email`: TEXT
- `position`: TEXT
- `department`: TEXT
- `phone`: TEXT
- `address`: TEXT
- `hire_date`: DATE
- `salary_annual`: NUMERIC
- `employment_status`: TEXT
- `employment_type`: TEXT
- `bank_account`: TEXT
- `tax_id`: TEXT
- `emergency_contact_name`: TEXT
- `emergency_contact_phone`: TEXT
- `status`: ENUM ('active', 'inactive', 'suspended')

#### 3. education_courses
- `id`: UUID (Primary Key)
- `course_name`: TEXT
- `course_code`: TEXT (Unique)
- `description`: TEXT
- `department`: TEXT
- `credits`: INTEGER
- `duration_weeks`: INTEGER
- `max_students`: INTEGER
- `status`: TEXT (default: 'active')
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

#### 4. course_enrollments
- `id`: UUID (Primary Key)
- `course_id`: UUID (References education_courses)
- `student_id`: UUID (References profiles.user_id)
- `enrollment_date`: TIMESTAMP
- `status`: TEXT (default: 'enrolled')
- `assignment_reason`: TEXT
- `completed_at`: TIMESTAMP
- `grade`: TEXT
- Unique constraint on (course_id, student_id)

#### 5. activity_logs
- `id`: UUID (Primary Key)
- `user_id`: UUID
- `action`: TEXT
- `entity_type`: TEXT
- `entity_id`: UUID
- `metadata`: JSONB
- `ip_address`: INET
- `user_agent`: TEXT
- `created_at`: TIMESTAMP

#### 6. notifications
- `id`: UUID (Primary Key)
- `user_id`: UUID
- `title`: TEXT
- `message`: TEXT
- `type`: TEXT (default: 'info')
- `priority`: TEXT (default: 'normal')
- `is_read`: BOOLEAN (default: false)
- `action_url`: TEXT
- `action_label`: TEXT
- `metadata`: JSONB
- `expires_at`: TIMESTAMP
- `created_at`: TIMESTAMP

#### 7. sessions
- `id`: UUID (Primary Key)
- `user_id`: UUID
- `token`: TEXT
- `ip_address`: INET
- `user_agent`: TEXT
- `is_active`: BOOLEAN
- `last_activity`: TIMESTAMP
- `expires_at`: TIMESTAMP
- `created_at`: TIMESTAMP

## User Roles & Permissions

### Admin
- Full system access
- User management (create, update, delete users)
- System configuration
- Access to all modules
- View all reports and analytics
- Manage RLS policies

### Staff
- Access to education management
- Student enrollment management
- View reports
- Manage courses and programs
- Limited user management

### Student
- View enrolled courses
- Access learning materials
- View personal progress
- Submit assignments
- View notifications

### Trainer
- Manage assigned courses
- View student progress
- Grade assignments
- Create course content
- Attendance management

## Key Features & Modules

### 1. Authentication & Authorization
- Email/password authentication
- Role-based access control (RBAC)
- Session management
- Activity logging
- Password reset functionality

### 2. Dashboard System
- Role-specific dashboards (Admin, Staff, Student, Trainer)
- Real-time statistics
- Activity feeds
- Quick actions
- Performance metrics

### 3. Education Management
- Course creation and management
- Student enrollment
- Attendance tracking
- Grade management
- Course scheduling

### 4. HR & Employee Management
- Employee records
- Payroll management (placeholder)
- Leave management
- Performance reviews
- Department organization

### 5. Student Management
- Student profiles
- Academic records
- Progress tracking
- Assignment management
- Certification tracking

### 6. Skill Development
- Training programs
- Skill assessments
- Certification management
- Progress analytics
- Training plans

### 7. Job Centre
- Job postings
- Application tracking
- Employer management
- Placement statistics
- Interview scheduling

### 8. Career Centre
- Career counseling
- Resource library
- Mentorship programs
- Career analytics
- Resume building

### 9. Incubation Hub
- Startup applications
- Funding tracking
- Mentorship management
- Program management
- Impact assessment

### 10. Made in Nagaland
- Local product showcase
- Producer management
- Product catalog
- Marketplace features
- Certification tracking

### 11. Livelihood Programs
- Program management
- Participant tracking
- Outcome assessment
- Community impact
- Resource allocation

### 12. Inventory Management
- Asset tracking
- Stock management
- Maintenance scheduling
- Asset reports
- Resource allocation

### 13. Reports & Analytics
- Custom report generation
- Data visualization
- Export functionality
- Scheduled reports
- Performance analytics

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies based on user roles:
- Users can only access their own data
- Admins have full access
- Staff have department-level access
- Proper foreign key constraints

### Security Functions
```sql
-- Get user role function (SECURITY DEFINER)
public.get_user_role(check_user_id uuid)
-- Returns the role of the specified user

-- Update timestamp trigger
public.update_updated_at_column()
-- Automatically updates the updated_at column
```

## API Integration Points

### Supabase Edge Functions
- `create-admin-user`: Creates admin users with proper authentication
- `create-notification`: Sends system notifications
- `send-notification-email`: Email notification service
- `upsert-user-with-profile`: User profile management

### Environment Configuration
- Supabase URL: Project-specific URL
- Supabase Anon Key: Public anonymous key
- Service Role Key: Server-side operations (secure)

## UI/UX Design Principles

### Design System
- Semantic color tokens (HSL-based)
- Consistent spacing and typography
- Responsive design (mobile-first)
- Dark/light mode support
- Accessible components (ARIA labels)

### Component Architecture
- Modular, reusable components
- Type-safe with TypeScript
- Form validation with Zod
- Loading and error states
- Toast notifications

## Data Flow

1. **Authentication Flow**:
   - User logs in → Supabase Auth
   - Profile fetched → Role determined
   - Role-based routing → Dashboard rendered

2. **Data Management**:
   - React Query for caching
   - Optimistic updates
   - Real-time subscriptions
   - Error handling with retry

3. **State Management**:
   - Local state for UI
   - React Query for server state
   - Context API for auth state
   - Form state with React Hook Form

## Development Guidelines

### Code Structure
```
src/
├── components/       # Reusable UI components
│   ├── auth/        # Authentication components
│   ├── dashboards/  # Role-specific dashboards
│   ├── ui/          # Base UI components (shadcn)
│   └── ...          # Feature-specific components
├── hooks/           # Custom React hooks
├── pages/           # Route pages
├── integrations/    # External service integrations
│   └── supabase/    # Supabase client and types
├── lib/             # Utility functions
└── utils/           # Helper functions
```

### Best Practices
1. Always use TypeScript for type safety
2. Implement proper error boundaries
3. Use semantic HTML for accessibility
4. Follow React best practices (hooks, memo, etc.)
5. Implement proper loading states
6. Use environment variables for configuration
7. Implement proper data validation
8. Follow REST/GraphQL conventions

## Deployment Considerations

### Performance
- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Database indexing
- Query optimization

### Monitoring
- Activity logging
- Error tracking
- Performance metrics
- User analytics
- Security auditing

### Scalability
- Database connection pooling
- Caching strategies
- CDN for static assets
- Load balancing
- Horizontal scaling ready

## Future Enhancements
- Multi-language support
- Advanced analytics dashboard
- Mobile application
- API for third-party integrations
- AI-powered recommendations
- Blockchain certificates
- Payment gateway integration
- Advanced reporting tools

## Usage Instructions

When implementing or modifying this system:

1. **Always check user authentication and role** before allowing any action
2. **Use the existing component library** (shadcn/ui) for consistency
3. **Follow the established design system** for colors and spacing
4. **Implement proper error handling** for all async operations
5. **Add activity logging** for audit trails
6. **Test RLS policies** before deploying
7. **Use TypeScript** for all new code
8. **Follow the existing file structure** for organization

## Common Operations

### Creating a New User
1. Use Supabase Auth signup
2. Trigger creates profile automatically
3. Assign appropriate role
4. Set initial permissions

### Adding a New Module
1. Create database tables with RLS
2. Add TypeScript interfaces
3. Create React components
4. Add to routing system
5. Update navigation menu
6. Add role-based access

### Modifying Permissions
1. Update RLS policies in Supabase
2. Update role checks in components
3. Test with different user roles
4. Update documentation

This system is designed to be extensible, secure, and user-friendly, providing a complete solution for youth development and skill training management.