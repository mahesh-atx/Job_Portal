require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');

async function testLogin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log(`\nTotal users: ${users.length}\n`);

        if (users.length === 0) {
            console.log('No users found. Please register first.');
            mongoose.connection.close();
            return;
        }

        users.forEach((user, index) => {
            console.log(`User ${index + 1}:`);
            console.log(`  Name: ${user.name}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Role: ${user.role}`);
            console.log(`  Created: ${user.createdAt}`);
            console.log('');
        });

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testLogin();
