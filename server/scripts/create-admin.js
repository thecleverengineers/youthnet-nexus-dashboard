const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://youthnet:46VT17Ar2B5n9FH0@localhost:27017/youthnet');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'thecleverengineers@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      email: 'thecleverengineers@gmail.com',
      password: 'Kites@123',
      profile: {
        fullName: 'Admin User',
        role: 'admin'
      },
      isEmailVerified: true,
      status: 'active'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: thecleverengineers@gmail.com');
    console.log('Password: Kites@123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdminUser();