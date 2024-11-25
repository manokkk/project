const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const cors = require('cors');
const dotenv = require("dotenv").config();
const app = express();
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require("./routes/orderRoutes");
app.use(cors());
app.use(express.json());

connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);  // Include the user routes
app.use('/api/order', orderRoutes)