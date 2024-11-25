const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const Product = require('../models/product'); // Import Product model
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer to handle file uploads (local storage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store uploaded files in the 'uploads' folder temporarily
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix); // Ensure unique filenames
  }
});

const upload = multer({ storage: storage });

router.post('/addproduct', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, description, quantity } = req.body; // Include quantity

    // Validate required fields
    if (!name || !category || !price || !description || !quantity) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Process the image if any (upload to Cloudinary)
    const image = req.file; // Get the image from the request
    let imageUrl = null;

    if (image) {
      const result = await cloudinary.uploader.upload(image.path); // Upload the image to Cloudinary
      imageUrl = result.secure_url; // Get the URL of the uploaded image
    }

    // Create a new product instance
    const newProduct = new Product({
      name,
      category,
      price,
      description,
      quantity, // Save the quantity value
      images: [
        {
          url: imageUrl, // Store the image URL
        },
      ],
    });

    // Save the product to the database
    await newProduct.save();

    // Return success response
    return res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.get('/products', async (req, res) => {
  console.log("GET request received to fetch products");

  try {
    // Fetch all products from the database
    const products = await Product.find();
   
    if (products.length === 0) {
      console.log("No products found");
      return res.status(404).json({ message: 'No products found' });
    }

    // Send the products as a response
    console.log("Returning products list");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/admin', authMiddleware, async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'No products found' });
    }

    // Return all products for admin management
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.put('/:id', upload.single('image'), async (req, res) => {  // Make sure to use multer's upload here
  try {
    const { id } = req.params;
    const { name, category, price, description, quantity } = req.body;
    let image = req.file;  // Get image from request, if any

    // Fetch the existing product
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // If no new image is uploaded, retain the existing image
    if (!image) {
      image = existingProduct.images[0];  // Retain the existing image
    } else {
      // If a new image is uploaded, upload it to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(image.path);
      image = {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      };
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { 
        name, 
        category, 
        price, 
        description, 
        quantity, 
        images: [image]  // Save new or old image
      },
      { new: true }  // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(500).json({ success: false, message: 'Product update failed' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});




module.exports = router;
