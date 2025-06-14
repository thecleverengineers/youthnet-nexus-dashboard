
-- Add missing columns to employees table for the staff data
ALTER TABLE employees ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS date_of_joining date;

-- Update existing hire_date column to be nullable since we'll use date_of_joining
ALTER TABLE employees ALTER COLUMN hire_date DROP NOT NULL;

-- Add a unique constraint on employee name if it doesn't exist
-- (We'll use full_name from profiles table as the identifier)
