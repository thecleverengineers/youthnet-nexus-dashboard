import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  role: z.enum(['student', 'trainer', 'staff', 'admin'])
});

export const updateProfileSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
    .optional(),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal(''))
});

// Employee validation schemas
export const employeeSchema = z.object({
  employeeId: z.string()
    .min(3, 'Employee ID must be at least 3 characters')
    .max(20, 'Employee ID must be less than 20 characters')
    .regex(/^[A-Z0-9]+$/, 'Employee ID can only contain uppercase letters and numbers'),
  position: z.string()
    .min(2, 'Position must be at least 2 characters')
    .max(100, 'Position must be less than 100 characters'),
  department: z.string()
    .min(2, 'Department must be at least 2 characters')
    .max(50, 'Department must be less than 50 characters'),
  salary: z.number()
    .min(0, 'Salary must be a positive number')
    .max(10000000, 'Salary seems unreasonably high'),
  emergencyContactName: z.string()
    .min(2, 'Emergency contact name must be at least 2 characters')
    .max(100, 'Emergency contact name must be less than 100 characters')
    .optional(),
  emergencyContactPhone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid emergency contact phone format')
    .optional()
});

// Student validation schemas
export const studentSchema = z.object({
  studentId: z.string()
    .min(3, 'Student ID must be at least 3 characters')
    .max(20, 'Student ID must be less than 20 characters')
    .regex(/^[A-Z0-9]+$/, 'Student ID can only contain uppercase letters and numbers'),
  enrollmentDate: z.date().optional(),
  status: z.enum(['active', 'inactive', 'graduated', 'suspended']).optional()
});

// Trainer validation schemas
export const trainerSchema = z.object({
  trainerId: z.string()
    .min(3, 'Trainer ID must be at least 3 characters')
    .max(20, 'Trainer ID must be less than 20 characters')
    .regex(/^[A-Z0-9]+$/, 'Trainer ID can only contain uppercase letters and numbers'),
  specialization: z.string()
    .min(2, 'Specialization must be at least 2 characters')
    .max(100, 'Specialization must be less than 100 characters'),
  qualification: z.string()
    .min(2, 'Qualification must be at least 2 characters')
    .max(200, 'Qualification must be less than 200 characters')
    .optional(),
  experienceYears: z.number()
    .min(0, 'Experience years must be a positive number')
    .max(50, 'Experience years seems unreasonably high')
    .optional()
});

// Task validation schemas
export const taskSchema = z.object({
  title: z.string()
    .min(3, 'Task title must be at least 3 characters')
    .max(200, 'Task title must be less than 200 characters'),
  description: z.string()
    .max(1000, 'Task description must be less than 1000 characters')
    .optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.date().optional(),
  estimatedHours: z.number()
    .min(0, 'Estimated hours must be a positive number')
    .max(1000, 'Estimated hours seems unreasonably high')
    .optional()
});

// Generic search validation
export const searchSchema = z.object({
  query: z.string()
    .max(100, 'Search query must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_@.]+$/, 'Search query contains invalid characters'),
  limit: z.number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be 100 or less')
    .optional(),
  offset: z.number()
    .min(0, 'Offset must be 0 or greater')
    .optional()
});

// Report validation schemas
export const reportSchema = z.object({
  title: z.string()
    .min(3, 'Report title must be at least 3 characters')
    .max(200, 'Report title must be less than 200 characters'),
  type: z.string()
    .min(2, 'Report type must be at least 2 characters')
    .max(50, 'Report type must be less than 50 characters'),
  department: z.string()
    .min(2, 'Department must be at least 2 characters')
    .max(50, 'Department must be less than 50 characters')
    .optional(),
  periodStart: z.date().optional(),
  periodEnd: z.date().optional()
});

// Sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potential XSS characters
    .slice(0, 1000); // Limit length
};

export const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .replace(/[^\w\s\-@.]/g, '') // Only allow word characters, spaces, hyphens, @ and .
    .slice(0, 100); // Limit length
};

// Validation helper functions
export const validateAndSanitize = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T; errors?: never } | { success: false; errors: string[]; data?: never } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { 
      success: false, 
      errors: ['Validation failed']
    };
  }
};

export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type EmployeeData = z.infer<typeof employeeSchema>;
export type StudentData = z.infer<typeof studentSchema>;
export type TrainerData = z.infer<typeof trainerSchema>;
export type TaskData = z.infer<typeof taskSchema>;
export type SearchData = z.infer<typeof searchSchema>;
export type ReportData = z.infer<typeof reportSchema>;