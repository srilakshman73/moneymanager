const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error('Check your MONGO_URI in .env and ensure MongoDB is running.');
        process.exit(1);
    }
};

module.exports = connectDB;
