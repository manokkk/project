import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import upload_area from '../Assets/upload_area.png';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddProduct = () => {
  const [image, setImage] = useState(null); // State for the selected image
  const [products, setProducts] = useState([]); // State for all products
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isEditing, setIsEditing] = useState(false); // Check if we're editing a product
  const [editProductId, setEditProductId] = useState(null); // Store the product ID for editing

  const token = localStorage.getItem('token'); // Get token from localStorage

  // Fetch all products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products/products', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Authorization header
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data); // Set the product list (data is an array of products)
      } else {
        alert('Failed to fetch products: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when the component mounts
  }, []);

  // Handle image selection
  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  // Add or update product
  const saveProduct = async (values) => {
    // Set loading state
    setIsLoading(true);

    try {
      const formData = new FormData();

      // If there is an image, append it to the form data
      if (image) {
        formData.append('image', image); // Append the new image if provided
      }

      // Append other product details
      formData.append('name', values.name);
      formData.append('category', values.category);
      formData.append('price', values.price);
      formData.append('description', values.description);
      formData.append('quantity', values.quantity); // Add quantity to the form data

      // Define the URL for adding or updating the product
      const url = isEditing
        ? `http://localhost:4000/api/products/${editProductId}`  // URL for editing
        : 'http://localhost:4000/api/products/addproduct';  // URL for adding a new product

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Send the form data with image and other fields
      });

      const data = await response.json();

      if (data.success) {
        alert(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
        fetchProducts(); // Refresh product list
      } else {
        alert(data.message || 'Failed to save product.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit product
  const editProduct = (product) => {
    setIsEditing(true);
    setEditProductId(product._id); // Store the product ID for editing
    setImage(product.images && product.images.length > 0 ? product.images[0].url : null);
  };

  // Delete product
  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert('Product deleted successfully!');
        fetchProducts(); // Refresh product list
      } else {
        alert(data.message || 'Failed to delete product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product.');
    }
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    price: Yup.number().required('Price is required').positive('Price must be a positive number'),
    description: Yup.string().required('Description is required'),
    quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
  });

  return (
    <div className="add-product">
      <Formik
        initialValues={{
          name: '',
          category: 'smartphones',
          price: '',
          description: '',
          quantity: 1,
        }}
        validationSchema={validationSchema}
        onSubmit={saveProduct}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form>
            <div className="addproduct-itemfield">
              <p>Product Title</p>
              <Field
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                name="name"
                placeholder="Type here"
              />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>

            <div className="addproduct-price">
              <div className="addproduct-itemfield">
                <p>Price</p>
                <Field
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  name="price"
                  placeholder="Type here"
                />
                <ErrorMessage name="price" component="div" className="error-message" />
              </div>

              <div className="addproduct-itemfield">
                <p>Description</p>
                <Field
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  name="description"
                  placeholder="Type here"
                />
                <ErrorMessage name="description" component="div" className="error-message" />
              </div>

              <div className="addproduct-itemfield">
                <p>Quantity</p>
                <Field
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="number"
                  name="quantity"
                  min="1"
                  placeholder="Quantity"
                />
                <ErrorMessage name="quantity" component="div" className="error-message" />
              </div>
            </div>

            <div className="addproduct-itemfield">
              <p>Product Category</p>
              <Field as="select" name="category" onChange={handleChange} onBlur={handleBlur}>
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops</option>
                <option value="wearables">Wearables</option>
                <option value="cameras">Cameras</option>
              </Field>
            </div>

            <div className="addproduct-itemfield">
              <label htmlFor="file-input">
                <img
                  src={image ? image : upload_area}
                  className="addproduct-thumbnail-img"
                  alt="Upload Preview"
                />
              </label>
              <input
                onChange={imageHandler}
                type="file"
                name="image"
                id="file-input"
                hidden
              />
            </div>

            <button type="submit" className="addproduct-btn" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Add'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="product-list">
        <h2>Product List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₱{product.price}</td>
                <td>{product.description}</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => editProduct(product)}>Edit</button>
                  <button onClick={() => deleteProduct(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddProduct;
