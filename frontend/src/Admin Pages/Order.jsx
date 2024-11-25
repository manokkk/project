import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import AdminNavbar from '../Admin Components/Admin Navbar/AdminNavbar';
import Sidebar from '../Admin Components/Sidebar/Sidebar';
import './CSS/Order.css'; // Import the CSS for layout styling

const Order = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/order/all');
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle status update
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/order/update-status/${orderId}`, {
        status: newStatus,
      });
      if (response.data.success) {
        // Update the order in the state to reflect the new status
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        console.log('Order status updated:', response.data.order);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="order-page-container">
        <Sidebar />
        <div className="order-list-container">
          <Typography variant="h4" gutterBottom>
            Order List
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell>Status</TableCell> {/* Add Status column */}
                  <TableCell>Update Status</TableCell> {/* Button/Dropdown to update status */}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.user?.email || 'N/A'}</TableCell>
                    <TableCell>₱{order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {order.product.map((product, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                          <p>
                            <strong>{product.name}</strong> (x{product.quantity || 1}
                            ) - ₱{product.price.toFixed(2)}
                          </p>
                          {product.images?.[0] && (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{order.status}</TableCell> {/* Display Status */}

                    <TableCell>
                      {/* Dropdown to update the status */}
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={order.status || ''}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          label="Status"
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Shipped">Shipped</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Order;
