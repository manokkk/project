import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API requests
import './ShowShop.css';
import Item from '../Item/Item';
import { Slider, Checkbox, FormControlLabel, FormGroup, Typography, Button } from '@mui/material';

const ShowShop = () => {
  const [priceRange, setPriceRange] = useState([0, 100000]); // Default price range
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories
  const [products, setProducts] = useState([]); // State to store fetched products
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state
  const [cart, setCart] = useState([]); // State for cart

  // Fetch all products from the server
  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem('token'); // Get the token from localStorage

    if (!token) {
      setError('No token found. Please login.');
      setLoading(false);
      return;  // Exit the function if the token is not found
    }

    try {
      const response = await axios.get('http://localhost:4000/api/products/products', {
        headers: {
          Authorization: `Bearer ${token}` // Send the token in the Authorization header
        }
      });

      setProducts(response.data); // Set the products directly from the response
      setLoading(false); // Set loading to false once data is received
    } catch (err) {
      setError('Error fetching products. Please try again.');
      setLoading(false);
      console.error('Fetch error:', err); // Log the error for debugging
    }
  };

  useEffect(() => {
    fetchProducts(); // Call fetchProducts when the component mounts

    // Retrieve cart data from localStorage on initial load
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
      setCart(savedCart); // Initialize the cart state with saved items
    }
  }, []);

  // Filter products based on price range and selected categories
  const filteredProducts = products.filter(item => {
    const price = item.price?.$numberInt ? parseInt(item.price.$numberInt) : item.price;
    const isWithinPriceRange = price >= priceRange[0] && price <= priceRange[1];
    const isInSelectedCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    return isWithinPriceRange && isInSelectedCategory;
  });

  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Handle category selection change
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategories(prevCategories => 
      prevCategories.includes(category) 
        ? prevCategories.filter(cat => cat !== category) 
        : [...prevCategories, category]
    );
  };

  const handleAddToCart = (product) => {
    if (!Array.isArray(cart)) {
      console.error("Cart is not an array. Resetting it.");
      setCart([]); // Reset the cart to an empty array
      localStorage.setItem('cart', JSON.stringify([]));
      return;
    }
  
    // Check if the product is already in the cart
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      alert("Product already in cart");
      return;
    }
  
    const updatedCart = [...cart, product]; // Add product
    setCart(updatedCart); // Update the cart state
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save to localStorage
    alert("Added to Cart");
  };
  

  // Get unique categories from all products
  const categories = [...new Set(products.map(item => item.category))];

  return (
    <div className="showshop" style={{ display: 'flex', padding: '20px', justifyContent: 'space-between' }}>
      {/* Filters Sidebar */}
      <div className="filters" style={{ width: '250px', marginRight: '20px' }}>
        <Typography variant="h6" sx={{ color: 'white' }}>Filters</Typography>

        {/* Price Range Filter */}
        <div className="filter-price" style={{ marginBottom: '20px' }}>
          <Typography variant="subtitle1" sx={{ color: 'white' }}>Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `₱${value}`}
            min={0}
            max={100000}
            step={1000}
            style={{ marginTop: '10px' }}
          />
          <Typography variant="body2" sx={{ color: 'white' }}>{`₱${priceRange[0]} - ₱${priceRange[1]}`}</Typography>
        </div>

        {/* Category Filter */}
        <div className="filter-category" style={{ marginBottom: '20px' }}>
          <Typography variant="subtitle1" sx={{ color: 'white' }}>Categories</Typography>
          <FormGroup sx={{ color: 'white' }}>
            {categories.map((category, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={handleCategoryChange}
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>
        </div>
      </div>

      {/* Product Grid */}
      <div className="showshop-item" style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {loading ? (
          <Typography variant="h6" sx={{ color: 'white' }}>Loading...</Typography>
        ) : error ? (
          <Typography variant="h6" sx={{ color: 'red' }}>{error}</Typography>
        ) : (
          filteredProducts.map((item, i) => {
            const price = item.price?.$numberInt ? parseInt(item.price.$numberInt) : item.price;
            const image = item.images?.[0]?.url; // Use the first image if exists
            const id = item._id?.$oid || item._id; // Convert MongoDB _id to string if needed
            return (
              <div key={i} className="product-container" style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <Item
                  id={id}
                  name={item.name}
                  image={image}
                  new_price={price}
                  old_price={item.old_price}
                  description={item.description} // Passed here
                  category={item.category}
                />
                {/* Add to Cart Button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(item)}
                  style={{ marginTop: '10px', width: '100%' }}
                >
                  Add to Cart
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ShowShop;
