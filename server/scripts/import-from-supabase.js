const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Import MongoDB models
const User = require('../models/User');
const Student = require('../models/Student');
const Trainer = require('../models/Trainer');
const Employee = require('../models/Employee');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://youthnet:46VT17Ar2B5n9FH0@db-mongodb-nyc3-34944-ffbfb8c2.mongo.ondigitalocean.com/youthnet', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Helper function to convert UUID to ObjectId format
const convertUUIDToObjectId = (uuid) => {
  if (!uuid) return null;
  // Generate a consistent ObjectId from UUID
  const hash = require('crypto').createHash('md5').update(uuid).digest('hex');
  return new mongoose.Types.ObjectId(hash.substring(0, 24));
};

// Helper function to convert dates
const convertDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

// Import Supabase data
const importSupabaseData = async () => {
  try {
    console.log('Fetching data from Supabase...');
    
    // Replace with your actual Supabase function URL
    const supabaseUrl = 'https://rstdujkrsfecrfmclnwu.supabase.co/functions/v1/export-data';
    const response = await axios.get(supabaseUrl, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGR1amtyc2ZlY3JmbWNsbnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTY3NTAsImV4cCI6MjA2NTIzMjc1MH0.nWvm5WFi1maU4dUOv0O7hwSV-4og9XE9UXTP-Ugwfp4`
      }
    });

    if (!response.data.success) {
      throw new Error('Failed to fetch data from Supabase');
    }

    const exportedData = response.data.data;
    console.log('Data fetched successfully');
    console.log('Summary:', response.data.summary);

    // Clear existing data (optional - comment out if you want to preserve existing data)
    console.log('Clearing existing MongoDB data...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await Trainer.deleteMany({});
    await Employee.deleteMany({});

    // Import Users from profiles
    console.log('Importing users...');
    const users = [];
    for (const profile of exportedData.profiles) {
      const user = new User({
        _id: convertUUIDToObjectId(profile.id),
        email: profile.email,
        profile: {
          fullName: profile.full_name || profile.email,
          phone: profile.phone,
          role: profile.role || 'student'
        },
        isEmailVerified: true,
        status: 'active',
        createdAt: convertDate(profile.created_at) || new Date(),
        updatedAt: convertDate(profile.updated_at) || new Date()
      });
      
      users.push(user);
    }

    if (users.length > 0) {
      await User.insertMany(users);
      console.log(`Imported ${users.length} users`);
    }

    // Import Students
    console.log('Importing students...');
    const students = [];
    for (const student of exportedData.students) {
      const studentDoc = new Student({
        _id: convertUUIDToObjectId(student.id),
        userId: convertUUIDToObjectId(student.user_id),
        studentId: student.student_id,
        enrollmentDate: convertDate(student.enrollment_date) || new Date(),
        status: student.status || 'active',
        dateOfBirth: convertDate(student.date_of_birth),
        gender: student.gender,
        educationLevel: student.education_level,
        emergencyContact: student.emergency_contact,
        emergencyPhone: student.emergency_phone,
        createdAt: convertDate(student.created_at) || new Date(),
        updatedAt: convertDate(student.updated_at) || new Date()
      });
      
      students.push(studentDoc);
    }

    if (students.length > 0) {
      await Student.insertMany(students);
      console.log(`Imported ${students.length} students`);
    }

    // Import Trainers
    console.log('Importing trainers...');
    const trainers = [];
    for (const trainer of exportedData.trainers) {
      const trainerDoc = new Trainer({
        _id: convertUUIDToObjectId(trainer.id),
        userId: convertUUIDToObjectId(trainer.user_id),
        trainerId: trainer.trainer_id,
        specialization: trainer.specialization,
        experienceYears: trainer.experience_years || 0,
        qualification: trainer.qualification,
        hireDate: convertDate(trainer.hire_date) || new Date(),
        status: trainer.status || 'active',
        createdAt: convertDate(trainer.created_at) || new Date(),
        updatedAt: convertDate(trainer.updated_at) || new Date()
      });
      
      trainers.push(trainerDoc);
    }

    if (trainers.length > 0) {
      await Trainer.insertMany(trainers);
      console.log(`Imported ${trainers.length} trainers`);
    }

    // Import Employees
    console.log('Importing employees...');
    const employees = [];
    for (const employee of exportedData.employees) {
      const employeeDoc = new Employee({
        _id: convertUUIDToObjectId(employee.id),
        userId: convertUUIDToObjectId(employee.user_id),
        employeeId: employee.employee_id,
        department: employee.department,
        position: employee.position,
        salary: employee.salary,
        hireDate: convertDate(employee.hire_date) || new Date(),
        employmentStatus: employee.employment_status || 'active',
        employmentType: employee.employment_type || 'full_time',
        managerId: employee.manager_id ? convertUUIDToObjectId(employee.manager_id) : null,
        emergencyContact: {
          name: employee.emergency_contact_name,
          phone: employee.emergency_contact_phone
        },
        bankAccount: employee.bank_account,
        taxId: employee.tax_id,
        gender: employee.gender,
        probationEndDate: convertDate(employee.probation_end_date),
        contractEndDate: convertDate(employee.contract_end_date),
        createdAt: convertDate(employee.created_at) || new Date(),
        updatedAt: convertDate(employee.updated_at) || new Date()
      });
      
      employees.push(employeeDoc);
    }

    if (employees.length > 0) {
      await Employee.insertMany(employees);
      console.log(`Imported ${employees.length} employees`);
    }

    console.log('Data import completed successfully!');
    
    // Display final counts
    const userCount = await User.countDocuments();
    const studentCount = await Student.countDocuments();
    const trainerCount = await Trainer.countDocuments();
    const employeeCount = await Employee.countDocuments();
    
    console.log('\nFinal MongoDB counts:');
    console.log(`Users: ${userCount}`);
    console.log(`Students: ${studentCount}`);
    console.log(`Trainers: ${trainerCount}`);
    console.log(`Employees: ${employeeCount}`);

  } catch (error) {
    console.error('Import error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await importSupabaseData();
  process.exit(0);
};

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Run the script
main();