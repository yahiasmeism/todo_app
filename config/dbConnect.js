const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.DATABASE_URI;
        if (!uri) {
            console.error('MongoDB URI is not defined!');
            return;
        }
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

module.exports = connectDB;
