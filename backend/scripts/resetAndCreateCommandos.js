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

const newCommandos = [
  {
    commandoId: 'COMMANDO-001',
    name: 'Commando Alpha',
    email: 'alpha@rescue.com',
    phone: '+1234567890',
    password: 'commando001',
  },
  {
    commandoId: 'COMMANDO-002',
    name: 'Commando Beta',
    email: 'beta@rescue.com',
    phone: '+1234567891',
    password: 'commando002',
  },
  {
    commandoId: 'COMMANDO-003',
    name: 'Commando Gamma',
    email: 'gamma@rescue.com',
    phone: '+1234567892',
    password: 'commando003',
  },
  {
    commandoId: 'COMMANDO-004',
    name: 'Commando Delta',
    email: 'delta@rescue.com',
    phone: '+1234567893',
    password: 'commando004',
  },
  {
    commandoId: 'COMMANDO-005',
    name: 'Commando Echo',
    email: 'echo@rescue.com',
    phone: '+1234567894',
    password: 'commando005',
  },
];

const resetAndCreateCommandos = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Error: MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Step 1: Remove all existing commandos (except admin)
    console.log('Step 1: Removing existing commandos...');
    const allCommandos = await Commando.find();
    let removedCount = 0;

    for (const commando of allCommandos) {
      // Don't delete if it's linked to admin user
      const user = await User.findById(commando.userId);
      if (user && user.role === 'admin') {
        console.log(`⚠️  Skipping admin commando: ${commando.commandoId}`);
        continue;
      }

      // Delete user account
      if (commando.userId) {
        await User.findByIdAndDelete(commando.userId);
      }
      // Delete commando
      await Commando.findByIdAndDelete(commando._id);
      removedCount++;
    }

    console.log(`✅ Removed ${removedCount} existing commando(s)\n`);

    // Step 2: Create 5 new commandos
    console.log('Step 2: Creating 5 new commandos...\n');
    const createdCommandos = [];

    for (const commandoData of newCommandos) {
      try {
        // Check if commando ID already exists
        const existingCommando = await Commando.findOne({ commandoId: commandoData.commandoId });
        if (existingCommando) {
          console.log(`⚠️  Commando ${commandoData.commandoId} already exists, skipping...`);
          continue;
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username: commandoData.commandoId });
        if (existingUser) {
          console.log(`⚠️  Username ${commandoData.commandoId} already exists, skipping...`);
          continue;
        }

        // Create user account with commandoId as username
        const user = new User({
          username: commandoData.commandoId,
          email: commandoData.email,
          password: commandoData.password,
          role: 'commando',
        });
        await user.save();

        // Create commando profile
        const commando = new Commando({
          commandoId: commandoData.commandoId,
          name: commandoData.name,
          email: commandoData.email,
          phone: commandoData.phone,
          userId: user._id,
        });
        await commando.save();

        createdCommandos.push({
          commandoId: commandoData.commandoId,
          name: commandoData.name,
          username: commandoData.commandoId,
          password: commandoData.password,
          email: commandoData.email,
        });

        console.log(`✅ Created: ${commandoData.name} (${commandoData.commandoId})`);
      } catch (error) {
        console.error(`❌ Error creating ${commandoData.name}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ COMMANDO CREATION COMPLETE');
    console.log('='.repeat(70));
    console.log('\n📋 LOGIN CREDENTIALS FOR NEW COMMANDOS:\n');

    createdCommandos.forEach((commando, index) => {
      console.log(`${index + 1}. ${commando.name}`);
      console.log('   ──────────────────────────────────────────────────────────');
      console.log(`   Commando ID: ${commando.commandoId}`);
      console.log(`   Username:    ${commando.username}`);
      console.log(`   Password:    ${commando.password}`);
      console.log(`   Email:       ${commando.email}`);
      console.log('');
    });

    console.log('='.repeat(70));
    console.log(`\n✅ Successfully created ${createdCommandos.length} new commando(s)!`);
    console.log('\n💡 These commandos can now login to the system.');
    console.log('   Username = Commando ID');
    console.log('   Password = As shown above\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetAndCreateCommandos();

