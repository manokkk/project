import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ListProduct = () => {
  // State for products
  const [products, setProducts] = useState([
    // Example product data
    { id: 1, name: "Smartphone A", category: "smartphones", image: "image1.jpg", new_price: 500, old_price: 600 },
    { id: 2, name: "Laptop B", category: "laptops", image: "image2.jpg", new_price: 1200, old_price: 1500 },
  ]);

  // State for dialog
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Open Add/Edit dialog
  const handleOpen = (product = null) => {
    setCurrentProduct(product || { id: "", name: "", category: "", image: "", new_price: "", old_price: "" });
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => setOpen(false);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  // Add or update product
  const handleSave = () => {
    if (currentProduct.id) {
      // Update product
      setProducts(products.map(p => (p.id === currentProduct.id ? currentProduct : p)));
    } else {
      // Add product
      setProducts([...products, { ...currentProduct, id: Date.now() }]);
    }
    handleClose();
  };

  // Delete product
  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div>
      <h1>List of Products</h1>
      {/* Add Product Button */}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Product
      </Button>

      {/* Product Table */}
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>New Price</TableCell>
              <TableCell>Old Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <img src={product.image} alt={product.name} width="50" />
                </TableCell>
                <TableCell>{product.new_price}</TableCell>
                <TableCell>{product.old_price}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(product)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(product.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentProduct?.id ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={currentProduct?.name || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            fullWidth
            value={currentProduct?.category || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            fullWidth
            value={currentProduct?.image || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="new_price"
            label="New Price"
            type="number"
            fullWidth
            value={currentProduct?.new_price || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="old_price"
            label="Old Price"
            type="number"
            fullWidth
            value={currentProduct?.old_price || ""}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListProduct;
