const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary'); // Cloudinary configuration
const User = require('../models/user'); // User model
const { login } = require('../controllers/authController'); // Login controller

// Set up multer for file uploads
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept only image files
    } else {
      cb(new Error('Only image files are allowed'), false); // Reject non-image files
    }
  },
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Log request body to verify
      console.log('Request body:', req.body);
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user in the database
      const user = await User.create({
        username,
        email,
        password: hashedPassword, // Store the hashed password
      });
  
      // Generate a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Respond with user info and token
      res.status(201).json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error('Error during registration:', error.message);
      res.status(500).json({ message: 'Server error, please try again' });
    }
  });
// Login route (No changes needed)
router.post('/login', login);

module.exports = router;
