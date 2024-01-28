const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        // console.log(MONGO_URL);
        const connectionInitialized = await mongoose.connect(MONGO_URL);
        console.log(`MongoDB Connected on Host: ${connectionInitialized.connection.host}`);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
