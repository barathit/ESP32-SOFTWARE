const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const Fighter = require('../models/Fighter');

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

// Create 5 fighter records (NO USER ACCOUNTS - fighters don't login)
const fighters = [
  {
    fighterId: 'FIGHTER-001',
    name: 'Fighter One',
    commandoId: 'COMMANDO-001', // This commando will manage this fighter
  },
  {
    fighterId: 'FIGHTER-002',
    name: 'Fighter Two',
    commandoId: 'COMMANDO-001',
  },
  {
    fighterId: 'FIGHTER-003',
    name: 'Fighter Three',
    commandoId: 'COMMANDO-001',
  },
  {
    fighterId: 'FIGHTER-004',
    name: 'Fighter Four',
    commandoId: 'COMMANDO-001',
  },
  {
    fighterId: 'FIGHTER-005',
    name: 'Fighter Five',
    commandoId: 'COMMANDO-001',
  },
];

const seedFighters = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Error: MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    const createdFighters = [];

    for (const fighterData of fighters) {
      try {
        // Check if fighter already exists
        const existingFighter = await Fighter.findOne({ fighterId: fighterData.fighterId });
        if (existingFighter) {
          console.log(`⚠️  Fighter ${fighterData.fighterId} already exists, skipping...`);
          continue;
        }

        // Create fighter record (NO USER ACCOUNT)
        const fighter = new Fighter({
          fighterId: fighterData.fighterId,
          name: fighterData.name,
          commandoId: fighterData.commandoId,
        });
        await fighter.save();

        createdFighters.push({
          fighterId: fighterData.fighterId,
          name: fighterData.name,
          commandoId: fighterData.commandoId,
        });

        console.log(`✅ Created: ${fighterData.name} (${fighterData.fighterId})`);
      } catch (error) {
        console.error(`❌ Error creating ${fighterData.name}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('FIGHTER RECORDS CREATED');
    console.log('='.repeat(60));
    console.log('\n⚠️  NOTE: Fighters do NOT have login accounts.');
    console.log('Only Commandos can login. Commandos manage fighters.\n');
    
    createdFighters.forEach((fighter, index) => {
      console.log(`${index + 1}. ${fighter.name}`);
      console.log(`   Fighter ID:  ${fighter.fighterId}`);
      console.log(`   Commando ID: ${fighter.commandoId}`);
      console.log('');
    });

    if (createdFighters.length === 0) {
      console.log('No new fighters created. All fighters already exist.');
    } else {
      console.log(`\n✅ Successfully created ${createdFighters.length} fighter record(s)!`);
      console.log('\n📝 Next Steps:');
      console.log('1. Create a Commando account (they can login)');
      console.log('2. Map ESP32 devices to fighters using Admin panel');
      console.log('3. Commando can then add these fighters to operations');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding fighters:', error);
    process.exit(1);
  }
};

seedFighters();
