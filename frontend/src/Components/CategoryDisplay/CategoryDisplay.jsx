import React from 'react'
import './CategoryDisplay.css'
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import smartphone from '../Assets/product_6.png'
import laptop from '../Assets/product_16.png'
import wearable from '../Assets/product_22.png'
import camera from '../Assets/product_31.png'

const CategoryDisplay = () => {
  return (
    <div className='categorydisplay'>
      <h1>Categories</h1>
      <hr />

      <div className='categorydisplay-item'>
        <Link to="/category/smartphones" className='category-item'>
          <img src={smartphone} alt='Smartphone' />
          <p>Smartphone</p>
        </Link>

        <Link to="/category/laptops" className='category-item'>
          <img src={laptop} alt='Laptop' />
          <p>Laptop</p>
        </Link>

        <Link to="/category/wearables" className='category-item'>
          <img src={wearable} alt='Wearable' />
          <p>Wearable</p>
        </Link>

        <Link to="/category/cameras" className='category-item'>
          <img src={camera} alt='Camera' />
          <p>Camera</p>
        </Link>
      </div>
    </div>
  )
}

export default CategoryDisplay
