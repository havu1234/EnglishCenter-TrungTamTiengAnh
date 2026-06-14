/**
 * Seed Users Script
 * Creates default users for testing
 */

const mongoose = require('mongoose');
const User = require('../models/User');

// Load environment variables
try {
  require('dotenv').config();
} catch (e) {
  console.log('dotenv not installed');
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/english-center';

const defaultUsers = [
  {
    username: 'admin',
    password: 'Admin@123',
    fullName: 'Quản Trị Viên',
    role: 'Admin',
    status: 'Hoạt động',
  },
  {
    username: 'teacher1',
    password: 'Teacher@123',
    fullName: 'Nguyễn Văn A',
    role: 'Giao_Vien',
    status: 'Hoạt động',
  },
  {
    username: 'receptionist1',
    password: 'Receptionist@123',
    fullName: 'Trần Thị B',
    role: 'Le_Tan',
    status: 'Hoạt động',
  },
  {
    username: 'accountant1',
    password: 'Accountant@123',
    fullName: 'Lê Văn C',
    role: 'Ke_Toan',
    status: 'Hoạt động',
  },
];

const seedUsers = async () => {
  try {
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    
    // Clear existing users
    await User.deleteMany({});
    console.log('✓ Cleared existing users');
    
    // Create default users
    for (const userData of defaultUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✓ Created user: ${userData.username} (${userData.role})`);
    }
    
    console.log('\n✅ Seed completed successfully!');
    console.log('\n📋 Default Users:');
    console.log('┌─────────────────┬──────────────────┬─────────────┐');
    console.log('│ Username        │ Password         │ Role        │');
    console.log('├─────────────────┼──────────────────┼─────────────┤');
    defaultUsers.forEach(user => {
      console.log(`│ ${user.username.padEnd(15)} │ ${user.password.padEnd(16)} │ ${user.role.padEnd(11)} │`);
    });
    console.log('└─────────────────┴──────────────────┴─────────────┘');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Seed failed:', error);
    process.exit(1);
  }
};

// Run seed
seedUsers();
