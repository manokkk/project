const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [false, 'Product name is required']
    },
    category: {
        type: String,
        required: [false, 'Product category is required']
    },
    price: {
        type: Number,
        required: [false, 'Product price is required']
    },
    description: {
        type: String,
        required: [false, 'Product description is required']
    },
    images: [
        {
            public_id: String,
            url: String
        }
    ],
    quantity: {
        type: Number,
        required: [false, 'Product quantity is required'],
        default: 1 // You can set a default value if needed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);
