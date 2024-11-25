const Product = require ('../models/product');
const cloudinary = require('cloudinary');

exports.newProduct = async (req, res) => {
    try {
        console.log(req.files); // Debugging line
        console.log(req.body); // Debugging line

        if (!req.files || !req.files.length) {
            return res.status(400).json({
                success: false,
                message: 'No images provided',
            });
        }

        const { name, category, price, description } = req.body;
        let imagesLinks = [];

        for (let i = 0; i < req.files.length; i++) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.files[i].path, {
                    folder: 'products',
                    width: 150,
                    crop: "scale",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: 'Image upload failed',
                    error: error.message,
                });
            }
        }

        const product = new Product({
            name,
            category,
            price,
            description,
            images: imagesLinks,
            // user: req.user.id
        });

        await product.save();

        return res.status(201).json({
            success: true,
            product,
        });
    } catch (error) {
        return res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.getProducts = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();

        // Check if products exist
        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found',
            });
        }

        // Return products in response
        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getSingleProduct = async (req, res, next) => {
    try {
        // Find the product by ID from the request parameters
        const product = await Product.findById(req.params.id);

        // Check if the product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Return the found product
        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        // Step 1: Find the product by ID
        let product = await Product.findById(req.params.id);

        // If product not found, return a 404 error
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Step 2: Prepare images array from request body
        let images = [];

        if (typeof req.body.images === 'string') {
            // If a single image is provided as a string
            images.push(req.body.images);
        } else if (req.body.images) {
            // If multiple images are provided as an array
            images = req.body.images;
        }

        // Step 3: Delete existing images if new images are provided
        if (images.length > 0 && product.images) {
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.uploader.destroy(product.images[i].public_id);
            }
        }

        // Step 4: Upload new images to Cloudinary
        let imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i], {
                folder: 'products',
                width: 150,
                crop: "scale",
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        // Step 5: Add new images to request body
        req.body.images = imagesLinks;

        // Step 6: Update product with new data
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        // Step 7: Send the updated product back in the response
        return res.status(200).json({
            success: true,
            product,
        });

    } catch (error) {
        // Step 8: Handle any errors
        console.error("Error updating product:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        // Step 1: Find the product by ID
        const product = await Product.findById(req.params.id);

        // Step 2: If product is not found, return 404 error
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Step 3: Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.uploader.destroy(product.images[i].public_id);
            }
        }

        // Step 4: Delete the product from the database
        await Product.findByIdAndDelete(req.params.id);

        // Step 5: Return success response
        return res.status(200).json({
            success: true,
            message: 'Product and associated images deleted successfully',
        });
        
    } catch (error) {
        // Handle any errors that occur
        console.error("Error deleting product:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error, could not delete product',
        });
    }
};









