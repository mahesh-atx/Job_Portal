require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');
const bcrypt = require('bcryptjs');

async function diagnosePasswordIssue() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB\n');

        const users = await User.find({}).select('+password');
        console.log(`Total users: ${users.length}\n`);

        for (const user of users) {
            console.log('----------------------------');
            console.log(`Email: ${user.email}`);
            console.log(`Name: ${user.name}`);
            console.log(`Role: ${user.role}`);
            
            const passwordHash = user.password;
            console.log(`Password Hash: ${passwordHash.substring(0, 30)}...`);
            console.log(`Hash Length: ${passwordHash.length}`);
            
            // Check if it starts with $2a$ or $2b$ (bcrypt format)
            const isBcrypt = passwordHash.startsWith('$2a$') || passwordHash.startsWith('$2b$');
            console.log(`Is Bcrypt Format: ${isBcrypt ? 'YES ✓' : 'NO ✗'}`);
            
            // Try to test password comparison
            console.log('\nTesting password comparison:');
            try {
                const testResult = await user.comparePassword('test123');
                console.log(`  'test123': ${testResult ? 'MATCH ✓' : 'No match'}`);
            } catch (e) {
                console.log(`  Error comparing: ${e.message}`);
            }
            
            console.log('');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

diagnosePasswordIssue();
