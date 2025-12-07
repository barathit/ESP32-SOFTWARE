const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Commando = require('../models/Commando');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  const rootEnvPath = path.join(__dirname, '..', '..', '.env');
  if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
  } else {
    console.error('Error: .env file not found in backend/ or root directory');
    process.exit(1);
  }
}

const createTestCommando = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Error: MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    const commandoId = 'COMMANDO-001';
    const password = 'commando123';

    // Check if commando already exists
    const existingCommando = await Commando.findOne({ commandoId });
    if (existingCommando) {
      console.log(`⚠️  Commando ${commandoId} already exists!`);
      console.log('\nLogin Credentials:');
      console.log(`   Username: ${commandoId}`);
      console.log(`   Password: [Check Admin Dashboard or database]`);
      process.exit(0);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username: commandoId });
    if (existingUser) {
      console.log(`⚠️  User with username ${commandoId} already exists!`);
      process.exit(0);
    }

    // Create user account
    const user = new User({
      username: commandoId,
      email: 'commando001@rescue.com',
      password: password,
      role: 'commando',
    });
    await user.save();

    // Create commando profile
    const commando = new Commando({
      commandoId: commandoId,
      name: 'Test Commando',
      email: 'commando001@rescue.com',
      phone: '+1234567890',
      userId: user._id,
    });
    await commando.save();

    console.log('✅ Test Commando created successfully!\n');
    console.log('='.repeat(60));
    console.log('COMMANDO LOGIN CREDENTIALS');
    console.log('='.repeat(60));
    console.log(`Username: ${commandoId}`);
    console.log(`Password: ${password}`);
    console.log('='.repeat(60));
    console.log('\nYou can now login with these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating test commando:', error);
    process.exit(1);
  }
};

createTestCommando();

