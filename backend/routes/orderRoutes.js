const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware'); // Adjust the path
const Order = require('../models/order'); // Adjust the path to your Order model
const User = require('../models/user');  // Adjust the path to your User model
const jwt = require('jsonwebtoken'); 

// Create a new order
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // This assumes the user object was attached in authMiddleware
        const { products } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No products found in the order' });
        }

        let totalPrice = 0;
        products.forEach(product => {
            if (!product.name || !product.price || product.images.length === 0) {
                return res.status(400).json({ message: 'Product details are incomplete' });
            }
            totalPrice += product.price * (product.quantity || 1); // Assuming each product has a quantity field
        });

        const newOrder = new Order({
            product: products,
            user: userId,
            totalPrice
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            order: newOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Fetch all orders
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('product'); // Populate product details if it's a reference

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found',
            });
        }

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});

// Fetch orders of the currently logged-in user (based on the last logged-in user ID stored in local storage)
router.get('/my-orders', async (req, res) => {
    try {
        // Get token from Authorization header
        const token = req.headers['authorization']?.split(' ')[1];  // `Bearer <token>`

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'No token provided. Please log in.'
            });
        }

        // Decode the token to extract userId
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decode the token using the JWT_SECRET from env
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        const userId = decoded.id;  // Assuming token contains user ID (you can adjust this as per your token structure)

        // Fetch the user from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Fetch orders based on the user's ID
        const orders = await Order.find({ user: userId })
            .populate('product')  // Populate product details
            .populate('user', 'name email');  // Populate user details

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found for this user'
            });
        }

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});

// Update order status
router.put('/update-status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate the status
        const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled']; // Add your own status options
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status provided. Valid statuses are: Pending, Shipped, Delivered, Cancelled.'
            });
        }

        // Find the order by ID and update its status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true } // Return the updated order
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Respond with the updated order
        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;
