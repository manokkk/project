const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');
const { bucket } = require('../config/firebase');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      // Ensure a file is uploaded
      if (!req.file || !req.file.path) {
          return res.status(400).json({ message: 'Profile picture is required' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Upload profile picture to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile',
          width: 150,
          crop: "scale"
      });

      // Create new user with profilePicture as an object
      const user = await User.create({
          username,
          email,
          password: hashedPassword,
          profilePicture: {
              public_id: result.public_id,
              url: result.secure_url
          }
      });

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Respond with user info and token
      res.status(201).json({
          user: {
              id: user._id,
              username: user.username,
              email: user.email,
              profilePicture: user.profilePicture
          },
          token
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    // Log the received email and password
    console.log('Received email:', email);  // Check the email coming in
    console.log('Received password:', password);  // Check the password coming in
  
    try {
      // Check if the user exists in the database
      const user = await User.findOne({ email });
      console.log('User found:', user);  // Log the user object to check if it's found
  
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Is password valid:', isPasswordValid);  // Log the result of password comparison
  
      if (!isPasswordValid) {
        console.log('Password is invalid');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // If user is found and password is valid, generate the JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Generated JWT token:', token);  // Log the generated token
  
      // Send the response with user data and token
      res.status(200).json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
        },
        token,
      });
    } catch (error) {
      // Log any error that occurs during login processing
      console.error('Error during login:', error);  // Log the error details
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { register, login };
