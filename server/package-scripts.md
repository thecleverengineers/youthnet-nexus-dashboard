# Data Migration Scripts

## Available Scripts for MongoDB Import

### 1. Import from Supabase
```bash
cd server
npm run import:supabase
```

This script will:
- Export all data from your Supabase database
- Transform the data for MongoDB format
- Import the data into your MongoDB database

### 2. Manual Import (if you need more control)
```bash
cd server
node scripts/import-from-supabase.js
```

### 3. Run with better output
```bash
cd server
node scripts/run-import.js
```

## Prerequisites

1. **MongoDB Connection**: Make sure your MongoDB database is running and accessible
2. **Supabase Edge Function**: The export function must be deployed
3. **Environment Variables**: Ensure your .env file has the correct MongoDB connection string

## What Gets Imported

The script imports the following data from Supabase:
- User profiles → MongoDB Users
- Students → MongoDB Students  
- Trainers → MongoDB Trainers
- Employees → MongoDB Employees
- And all related data with proper relationships

## Data Transformation

- UUIDs are converted to MongoDB ObjectIds
- Dates are properly formatted
- Relationships are maintained using ObjectId references
- Schema is adapted to match MongoDB models

## Troubleshooting

If the import fails:
1. Check MongoDB connection
2. Verify Supabase edge function is deployed
3. Check the console output for specific error messages
4. Ensure your API keys are correct