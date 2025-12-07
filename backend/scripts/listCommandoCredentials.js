const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const Commando = require('../models/Commando');
const User = require('../models/User');

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

const listCommandoCredentials = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Error: MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Get all commandos with their user accounts
    const commandos = await Commando.find({ isActive: true })
      .populate('userId', 'username email')
      .sort({ commandoId: 1 });

    if (commandos.length === 0) {
      console.log('No commandos found in the database.');
      console.log('\nTo create a commando:');
      console.log('1. Login as admin');
      console.log('2. Go to Admin Dashboard → Commandos');
      console.log('3. Click "Register New Commando"');
      process.exit(0);
    }

    console.log('='.repeat(70));
    console.log('COMMANDO LOGIN CREDENTIALS');
    console.log('='.repeat(70));
    console.log('\n');

    commandos.forEach((commando, index) => {
      const user = commando.userId;
      const loginUsername = user?.username || commando.commandoId;
      console.log(`${index + 1}. ${commando.name}`);
      console.log('   ──────────────────────────────────────────────────────────');
      console.log(`   Commando ID: ${commando.commandoId}`);
      console.log(`   📧 Email:    ${commando.email}`);
      console.log(`   📞 Phone:    ${commando.phone || 'N/A'}`);
      console.log(`   Status:      ${commando.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log('');
      console.log(`   🔐 LOGIN CREDENTIALS:`);
      console.log(`   Username: ${loginUsername}`);
      console.log(`   Password: [Set during registration - cannot retrieve]`);
      if (loginUsername !== commando.commandoId) {
        console.log(`   ⚠️  Note: Username differs from Commando ID. Use: ${loginUsername}`);
      } else {
        console.log(`   ✓ Username = Commando ID`);
      }
      console.log('');
    });

    console.log('='.repeat(70));
    console.log(`Total Commandos: ${commandos.length}`);
    console.log('='.repeat(70));
    console.log('\n📝 IMPORTANT NOTES:');
    console.log('   • Passwords are encrypted and cannot be retrieved');
    console.log('   • Username = Commando ID (for new commandos)');
    console.log('   • To reset password: Edit commando in Admin Dashboard');
    console.log('   • To create new commando: Admin Dashboard → Register Commando');
    console.log('\n💡 TIP: When creating a commando, save the password immediately!');

    process.exit(0);
  } catch (error) {
    console.error('Error listing commandos:', error);
    process.exit(1);
  }
};

listCommandoCredentials();

