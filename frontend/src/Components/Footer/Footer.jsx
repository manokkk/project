import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo.png'
import fb_icon from '../Assets/fb_icon.png'
import gmail_icon from '../Assets/gmail_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-logo">
            <img src={footer_logo} alt="" />
            <p>GADGETGalaxy</p>
        </div>
        <ul className="footer-links">
            <li>Home</li>
            <li>Shop</li>
            <li>Category</li>
            <li>About</li>
            <li>Reviews</li>
        </ul>
        <div className="footer-social-icon">
            <div className="footer-icons-container">
                <img src={fb_icon} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={gmail_icon} alt="" />
            </div>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright @ 2024 - GadgetGalaxy - All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer
