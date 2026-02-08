/**
 * Test Data Setup Script
 * Run this to populate your database with sample data
 * 
 * Usage: node setup-test-data.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civic-issues';

// Sample data
const setupTestData = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('\n🗑️  Clearing existing test data...');
    // await db.collection('users').deleteMany({ email: { $regex: '@test.com' } });
    // await db.collection('departments').deleteMany({});
    // await db.collection('reports').deleteMany({});

    // 1. Create Departments
    console.log('\n📁 Creating departments...');
    const departments = [
      {
        name: 'Sanitation Department',
        code: 'SANITATION',
        description: 'Handles garbage collection and street cleaning',
        contactEmail: 'sanitation@civic.gov',
        contactPhone: '9876543210',
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Public Works',
        code: 'PUBLIC_WORKS',
        description: 'Road maintenance and infrastructure',
        contactEmail: 'publicworks@civic.gov',
        contactPhone: '9876543211',
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Parks & Recreation',
        code: 'PARKS_REC',
        description: 'Maintains parks and recreational facilities',
        contactEmail: 'parks@civic.gov',
        contactPhone: '9876543212',
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const createdDepts = await db.collection('departments').insertMany(departments);
    const deptIds = Object.values(createdDepts.insertedIds);
    console.log(`✅ Created ${deptIds.length} departments`);

    // 2. Create Admin (if doesn't exist)
    console.log('\n👤 Creating admin user...');
    const adminExists = await db.collection('users').findOne({ role: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await db.collection('users').insertOne({
        email: 'admin@gmail.com',
        password: hashedPassword,
        fullName: 'System Administrator',
        phoneNumber: null,
        profileImage: null,
        address: {},
        role: 'admin',
        accountStatus: 'active',
        authProvider: 'local',
        googleId: null,
        assignedDepartments: [],
        isEmailVerified: true,
        isActive: true,
        isDeleted: false,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Created admin user (admin@gmail.com / admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // 3. Create Officers
    console.log('\n👮 Creating officers...');
    const officers = [
      {
        email: 'officer1@gmail.com',
        password: await bcrypt.hash('officer123', 12),
        fullName: 'John Officer',
        phoneNumber: '9876543220',
        badgeNumber: 'OFF-001',
        role: 'officer',
        accountStatus: 'active',
        authProvider: 'local',
        assignedDepartments: [deptIds[0], deptIds[1]], // Sanitation + Public Works
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'officer2@gmail.com',
        password: await bcrypt.hash('officer123', 12),
        fullName: 'Jane Smith',
        phoneNumber: '9876543221',
        badgeNumber: 'OFF-002',
        role: 'officer',
        accountStatus: 'active',
        authProvider: 'local',
        assignedDepartments: [deptIds[2]], // Parks & Rec
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const createdOfficers = await db.collection('users').insertMany(officers);
    const officerIds = Object.values(createdOfficers.insertedIds);
    console.log(`✅ Created ${officerIds.length} officers`);

    // 4. Create Citizens
    console.log('\n👥 Creating citizens...');
    const citizens = [
      {
        email: 'citizen1@gmail.com',
        password: await bcrypt.hash('citizen123', 12),
        fullName: 'Alice Citizen',
        phoneNumber: '9876543230',
        role: 'citizen',
        accountStatus: 'active',
        authProvider: 'local',
        assignedDepartments: [],
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'citizen2@gmail.com',
        password: await bcrypt.hash('citizen123', 12),
        fullName: 'Bob Smith',
        phoneNumber: '9876543231',
        role: 'citizen',
        accountStatus: 'active',
        authProvider: 'local',
        assignedDepartments: [],
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const createdCitizens = await db.collection('users').insertMany(citizens);
    const citizenIds = Object.values(createdCitizens.insertedIds);
    console.log(`✅ Created ${citizenIds.length} citizens`);

    // 5. Create Sample Reports
    console.log('\n📝 Creating sample reports...');
    const reports = [
      {
        title: 'Broken streetlight on Main St',
        description: 'The streetlight has been out for 3 days, making the area unsafe at night',
        status: 'submitted',
        location: {
          type: 'Point',
          coordinates: [78.4867, 17.385],
          address: 'Main St, Hyderabad, Telangana, India',
        },
        media: { images: [], videos: [], audio: [] },
        citizen: citizenIds[0],
        department: deptIds[1], // Public Works
        assignedOfficer: null,
        statusHistory: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Garbage not collected for 2 weeks',
        description: 'Our street has not had garbage collection in 2 weeks. Piles accumulating.',
        status: 'in_progress',
        location: {
          type: 'Point',
          coordinates: [78.4900, 17.390],
          address: '2nd St, Hyderabad, Telangana, India',
        },
        media: { images: [], videos: [], audio: [] },
        citizen: citizenIds[1],
        department: deptIds[0], // Sanitation
        assignedOfficer: officerIds[0],
        statusHistory: [
          {
            status: 'in_progress',
            timestamp: new Date(),
            updatedBy: officerIds[0],
          },
        ],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(),
      },
      {
        title: 'Pothole on Highway',
        description: 'Large pothole causing accidents',
        status: 'resolved',
        location: {
          type: 'Point',
          coordinates: [78.4950, 17.395],
          address: 'Highway, Hyderabad, Telangana, India',
        },
        media: { images: [], videos: [], audio: [] },
        citizen: citizenIds[0],
        department: deptIds[1], // Public Works
        assignedOfficer: officerIds[0],
        statusHistory: [
          {
            status: 'in_progress',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            updatedBy: officerIds[0],
          },
          {
            status: 'resolved',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            updatedBy: officerIds[0],
          },
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];

    await db.collection('reports').insertMany(reports);
    console.log(`✅ Created ${reports.length} sample reports`);

    console.log('\n✅ Test data setup complete!');
    console.log('\n📝 Test Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Admin:    admin@gmail.com / admin123');
    console.log('Officer1: officer1@gmail.com / officer123');
    console.log('Officer2: officer2@gmail.com / officer123');
    console.log('Citizen1: citizen1@gmail.com / citizen123');
    console.log('Citizen2: citizen2@gmail.com / citizen123');
    console.log('─────────────────────────────────────');

    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up test data:', error);
    process.exit(1);
  }
};

setupTestData();