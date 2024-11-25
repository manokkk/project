import React, { useState, useEffect } from "react";
import './CartItems.css';
import remove_icon from '../Assets/cart-cross_icon.png';

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [user, setUser] = useState(null); // Assuming the user is authenticated

  // Load cart items and user data when the component mounts
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    // Simulating user data (in a real app, this would be fetched from auth context or API)
    const storedUser = JSON.parse(localStorage.getItem('user')); // Replace with actual user data if needed
    setUser(storedUser);
  }, []);

  const getTotalCartAmount = () => {
    return selectedItems.reduce(
      (total, productId) => {
        const product = cartItems.find((item) => item._id === productId);
        return total + (product?.price || 0) * (product?.quantity || 0);
      },
      0
    );
  };

  const handleCheckboxChange = (productId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(productId)
        ? prevSelectedItems.filter((id) => id !== productId)
        : [...prevSelectedItems, productId]
    );
  };

  const handleRemoveProduct = (productId) => {
    const updatedCart = cartItems.filter((product) => product._id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    setSelectedItems([]);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }
  
    // Use selected cart items or show alert if none are selected
    if (selectedItems.length === 0) {
      alert("Please select products to place an order.");
      return;
    }
  
    // Filter the cart items based on selected items
    const productsToOrder = cartItems.filter((item) => selectedItems.includes(item._id));
  
    // Create order data
    const orderData = {
      products: productsToOrder.map((item) => ({
        name: item.name,
        price: item.price,
        images: item.images, // Assuming images is an array of objects with public_id and url
        quantity: item.quantity,
      })),
      userId: user._id, // Using user._id for the order
      totalPrice: productsToOrder.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    };
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:4000/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Order placed successfully!");
        // Remove only the selected products from the cart
        const updatedCart = cartItems.filter(
          (item) => !selectedItems.includes(item._id)
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setSelectedItems([]); // Clear the selection
      } else {
        alert(result.message || "Error placing order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  
  return (
    <div className="cartitems">
      <h1>Your Cart</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Product</th>
            <th>Image</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.length > 0 ? (
            cartItems.map((product) => (
              <tr key={product._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(product._id)}
                    onChange={() => handleCheckboxChange(product._id)}
                  />
                </td>
                <td>{product.name}</td>
                <td>
                  <img
                    src={product.image} // Assuming `image` is the correct field for product image
                    className="carticon-product-icon"
                    alt={product.name}
                  />
                </td>
                <td>₱{product.price}</td>
                <td>{product.quantity}</td>
                <td>₱{product.price * product.quantity}</td>
                <td>
                  <img
                    className="cartitems-remove-icon"
                    src={remove_icon}
                    alt="Remove item"
                    onClick={() => handleRemoveProduct(product._id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No products in your cart.</td>
            </tr>
          )}
        </tbody>
      </table>

      {cartItems.length > 0 && (
        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
              <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>₱{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <p>Shipping Fee</p>
                <p>Free</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>₱{getTotalCartAmount()}</h3>
              </div>
            </div>
            <button onClick={handlePlaceOrder}>PROCEED TO CHECKOUT</button>
            <button
              style={{
                backgroundColor: 'red',
                color: 'white',
                marginTop: '20px',
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={handleClearCart}
            >
              CLEAR CART
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItems;
