const mongoose = require('mongoose');

// Define the Order Schema
const OrderSchema = new mongoose.Schema({
    product: [{
        name: {
            type: String,
            required: [true, 'Product name is required']
        },
        price: {
            type: Number,
            required: [true, 'Product price is required']
        },
        images: [
            {
                public_id: String,
                url: String
            }
        ]
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: [true, 'User is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        default: 1
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0, // Can be calculated as price * quantity
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add a pre-save middleware to calculate totalPrice if not explicitly set
OrderSchema.pre('save', function (next) {
    if (!this.totalPrice) {
        // Sum up price * quantity for each product in the order
        this.totalPrice = this.product.reduce((total, item) => {
            return total + (item.price * this.quantity);
        }, 0);
    }
    next();
});

module.exports = mongoose.model('Order', OrderSchema);
