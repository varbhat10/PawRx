const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Pet = require('./models/Pet');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pawrx');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create demo users
const createDemoUsers = async () => {
  try {
    // Check if demo users already exist
    const existingUser = await User.findOne({ email: 'user@demo.com' });
    const existingVet = await User.findOne({ email: 'vet@demo.com' });

    if (existingUser && existingVet) {
      console.log('✅ Demo accounts already exist');
      return { user: existingUser, vet: existingVet };
    }

    // Create demo pet owner
    let demoUser;
    if (!existingUser) {
      demoUser = await User.create({
        name: 'Demo Pet Owner',
        email: 'user@demo.com',
        password: 'password123',
        role: 'user',
        phone: '+1-555-0123'
      });
      console.log('✅ Created demo pet owner account');
    } else {
      demoUser = existingUser;
    }

    // Create demo veterinarian
    let demoVet;
    if (!existingVet) {
      demoVet = await User.create({
        name: 'Dr. Bhat',
        email: 'vet@demo.com',
        password: 'password123',
        role: 'vet',
        phone: '+1-555-0456',
        vetInfo: {
          licenseNumber: 'VET12345',
          clinic: 'Sophies Veterinary Clinic',
          specializations: ['Small Animals', 'Emergency Medicine']
        }
      });
      console.log('✅ Created demo veterinarian account');
    } else {
      demoVet = existingVet;
    }

    return { user: demoUser, vet: demoVet };
  } catch (error) {
    console.error('❌ Error creating demo users:', error);
    throw error;
  }
};

// Create demo pet
const createDemoPet = async (userId) => {
  try {
    // Check if demo pet already exists
    const existingPet = await Pet.findOne({ owner: userId, name: 'Sophie' });
    
    if (existingPet) {
      console.log('✅ Demo pet already exists');
      return existingPet;
    }

    const demoPet = await Pet.create({
      name: 'Sophie',
      species: 'cat',
      breed: 'Siamese',
      weight: 10,
      weightUnit: 'lbs',
      age: 10,
      ageUnit: 'years',
      sex: 'female',
      neutered: true,
      owner: userId,
      veterinarian: {
        name: 'Dr. Bhat',
        clinic: 'Sophies Veterinary Clinic',
        phone: '+1-555-0456'
      },
      medicalHistory: {
        allergies: ['Lactose'],
        chronicConditions: ['Kidney disease', 'Feline Lower Urinary Tract Disease'],
        vaccinations: [
          {
            vaccine: 'FVRCP',
            date: new Date('2024-01-15'),
            nextDue: new Date('2025-01-15')
          }
        ]
      },
      currentMedications: [
        {
          name: 'Meloxicam',
          brandName: 'Metacam',
          dosage: '0.5mg',
          frequency: 'once daily',
          route: 'oral',
          startDate: new Date('2024-01-01'),
          prescribedBy: 'Dr. Bhat',
          reason: 'Arthritis pain management',
          instructions: 'Give with food',
          status: 'active'
        }
      ]
    });

    console.log('✅ Created demo pet');
    return demoPet;
  } catch (error) {
    console.error('❌ Error creating demo pet:', error);
    throw error;
  }
};

// Main setup function
const setupDemoData = async () => {
  try {
    console.log('🐾 Setting up PawRX demo data...');
    
    await connectDB();
    
    const { user, vet } = await createDemoUsers();
    await createDemoPet(user._id);
    
    console.log('\n🎉 Demo data setup complete!');
    console.log('📧 Demo Accounts:');
    console.log('   Pet Owner: user@demo.com / password123');
    console.log('   Veterinarian: vet@demo.com / password123');
    console.log('\n🌐 Try logging in at: http://localhost:3000');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
};

// Run setup
setupDemoData(); 