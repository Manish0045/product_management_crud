const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'price must be provided']
    },
    featured: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 4.9
    },
    company: {
        type: String,
        enum: ['Redmi', 'MI', 'Dell', 'HP', 'Apple', 'Samsung', 'Acer'],
        message: '{VALUE} is not supported'
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Product', productSchema, 'products')