import React from 'react';
import AdminNavbar from '../Admin Components/Admin Navbar/AdminNavbar';
import Sidebar from '../Admin Components/Sidebar/Sidebar';
import AddProduct from '../Admin Components/AddProduct/AddProduct';
import './CSS/Add_Product.css'; // Add a CSS file for styling

const Add_Product = () => {
  return (
    <div className="add-product-page">
        {/* Navbar */}
        <AdminNavbar />

        {/* Sidebar and AddProduct Content */}
        <div className="main-content">
            <Sidebar />
            <AddProduct />
        </div>
    </div>
  );
};

export default Add_Product;
