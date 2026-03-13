require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function resetPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const users = await User.find({});
        
        if (users.length === 0) {
            console.log('❌ No users found in database');
            mongoose.connection.close();
            return;
        }

        console.log('📋 Available users:');
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. Email: ${user.email}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Role: ${user.role}`);
        });

        rl.question('\nEnter the number of the user to reset password: ', async (userIndex) => {
            const index = parseInt(userIndex) - 1;
            
            if (index < 0 || index >= users.length) {
                console.log('❌ Invalid selection');
                mongoose.connection.close();
                rl.close();
                return;
            }

            const selectedUser = users[index];
            
            rl.question('Enter new password: ', async (newPassword) => {
                try {
                    // Update the password - the pre-save hook will hash it
                    selectedUser.password = newPassword;
                    await selectedUser.save();
                    
                    console.log('\n✅ Password reset successful!');
                    console.log(`\nYour login credentials:`);
                    console.log(`Email: ${selectedUser.email}`);
                    console.log(`Password: ${newPassword}`);
                    console.log(`\nYou can now log in with these credentials!`);
                    
                    mongoose.connection.close();
                    rl.close();
                } catch (error) {
                    console.error('❌ Error resetting password:', error.message);
                    mongoose.connection.close();
                    rl.close();
                }
            });
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        rl.close();
    }
}

resetPassword();
