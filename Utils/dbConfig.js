const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URI + '/' + process.env.DATABASE;

const connectDB = async () => {
    try {
        // console.log(MONGO_URL);
        const connectionInitialized = await mongoose.connect(MONGO_URL);
        console.log(`MongoDB Connected on Host: ${connectionInitialized.connection.host} ...\nDatabase: ${process.env.DATABASE}`);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
