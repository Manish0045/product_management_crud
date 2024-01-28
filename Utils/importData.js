require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose');
const Product = require('../Models/product.model');
const productJSON = require('../products.json');
const connectDB = require('./dbConfig');

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI + '/' + process.env.DATABASE); // Assuming your MongoDB URI includes the database name
        console.log('Database connected...');

        await Product.create(productJSON);
        console.log('Data inserted successfully.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
};

start();
