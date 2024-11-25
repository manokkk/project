const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const upload = multer({ dest: 'uploads/' });  // Store file temporarily before uploading

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// Route to fetch user profile data
router.get('/profile', authMiddleware, async (req, res) => {
    try {
      // Fetch the user from the database using the ID from the JWT token
      const user = await User.findById(req.user.id);
      
      // Check if the user exists
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      // Log the user data (useful for debugging)
      console.log(`Fetched user data: ${JSON.stringify(user)}`);
      
      // Construct the profile data object
      const userProfile = {
        username: user.username,
        email: user.email,
        profileImage: user.profilePicture ? user.profilePicture : null, // Ensure this is correctly assigned
      };
  
      // Log the profile data (ensure profile image URL is correct)
      console.log(`User profile fetched successfully: ${JSON.stringify(userProfile)}`); // Debugging log
      
      // Send the user profile data as response
      res.json(userProfile);
    } catch (err) {
      // Log any errors to help diagnose issues
      console.error("Error fetching profile data", err);
      res.status(500).json({ message: 'Error fetching profile data' });
    }
  });
  
// PUT route to update the user's profile
router.put('/profile', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If a new profile picture is provided, upload it to Cloudinary
    if (req.file) {
      // Upload the profile picture to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_pictures',  // Folder in Cloudinary to store the images
      });

      // Save the Cloudinary URL in the user's profileImage field
      user.profileImage = result.secure_url;  // Store the URL provided by Cloudinary
    }

    // Update the username and email if provided
    if (username) user.username = username;
    if (email) user.email = email;

    // Save the updated user document
    await user.save();

    // Return the updated user profile data including the Cloudinary URL for the profile image
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,  // Cloudinary URL of the profile image
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
