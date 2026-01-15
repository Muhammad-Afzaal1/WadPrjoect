const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    category: String,
    // Reference to the User who added the product 
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
        required: true
    },
    // Array of strings to store image URLs or paths [cite: 7]
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['enabled', 'disabled'],
        default: 'enabled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAuction: {
        type: Boolean,
        default: false
    },
    auctionEnd: {
        type: Date
    },
    startingBid: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Product', productSchema, 'Product');