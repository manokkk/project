import React from 'react'
import './Sidebar.css'
import {Link} from 'react-router-dom'
import add_product_icon from '../Assets/Product_Cart.png'
import list_product_icon from '../Assets/Product_list.png'
import category_icon from '../Assets/category_icon.png'
import order_icon from '../Assets/order_icon.png'
import review_icon from '../Assets/review_icon.png'

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Link to ={'/addproduct'} style={{textDecoration: "none"}}>
            <div className="sidebar-item">
                <img src={add_product_icon} alt="" />
                <p>Add Product</p>
            </div>
        </Link>
        <Link to ={'/orders'} style={{textDecoration: "none"}}>
            <div className="sidebar-item">
                <img src={order_icon} alt="" />
                <p>Orders</p>
            </div>
        </Link>
        <Link to ={'/review'} style={{textDecoration: "none"}}>
            <div className="sidebar-item">
                <img src={review_icon} alt="" />
                <p>Reviews</p>
            </div>
        </Link>
    </div>
  )
}

export default Sidebar
