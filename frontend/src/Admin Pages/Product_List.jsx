import React from 'react'
import AdminNavbar from '../Admin Components/Admin Navbar/AdminNavbar';
import Sidebar from '../Admin Components/Sidebar/Sidebar';
import ListProduct from '../Admin Components/ListProduct/ListProduct';

const Product_List = () => {
  return (
    <div className="product-list-page">
        {/* Navbar */}
        <AdminNavbar />

        {/* Sidebar and AddProduct Content */}
        <div className="main-content">
            <Sidebar />
            <ListProduct />
        </div>
    </div>
  )
}

export default Product_List