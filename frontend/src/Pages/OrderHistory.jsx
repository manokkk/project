import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderHistory.css';  // Import the CSS file
import Navbar from '../Components/Navbar/Navbar'

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Function to fetch orders for the logged-in user
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage

      if (!token) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/api/order/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

        if (response.data.success) {
          setOrders(response.data.orders);  // Set orders data from the response
        } else {
          setError('No orders found');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    // Call fetchOrders when component mounts
    fetchOrders();
  }, []);  // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <Navbar/>

    <div className="order-history">
      <h2>Order History</h2>

      {/* Display error if there is any */}
      {error && <div className="error">{error}</div>}

      {/* If no orders */}
      {orders.length === 0 ? (
        <div>No orders found</div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.status}</td>
                <td>${order.totalPrice}</td>
                <td>
                  <ul>
                    {order.product.map((product, index) => (
                      <li key={index} className="product-item">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="product-image"
                        />
                        <span>{product.name} - ${product.price} x {product.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default OrderHistory;
