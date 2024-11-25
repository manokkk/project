import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import nav_dropdown from '../Assets/nav_dropdown.png';

const Navbar = () => {
    const [menu, setMenu] = useState("home");
    const [submenu, setSubmenu] = useState("");
    const [user, setUser] = useState(null);

    const menuRef = useRef();

    useEffect(() => {
        // Check if the user is logged in by looking in localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Parse and set user data
        }
    }, []); // This runs only on initial mount

    // Toggle function for burger menu
    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    };

    const handleLogout = () => {
        // Remove user data from localStorage and clear user state
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null); // Update the state to reflect logout
    };

    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt="GadgetGalaxy logo" />
                <p>GADGETGalaxy</p>
            </div>
            <img
                className='nav-dropdown'
                onClick={dropdown_toggle}
                src={nav_dropdown}
                alt="burger menu"
            />
            <ul ref={menuRef} className="nav-menu">
                <li onClick={() => setMenu("home")}>
                    <Link className="nav-link" to="/home">Home</Link>
                    {menu === "home" ? <hr /> : <></>}
                </li>
                <li onClick={() => setMenu("shop")}>
                    <Link className="nav-link" to="/shop">Shop</Link>
                    {menu === "shop" ? <hr /> : <></>}
                </li>
                <li className="dropdown" onClick={() => setMenu("cate")}>
                    <Link className="nav-link" to="/category">Category</Link>
                    {menu === "cate" ? <hr /> : <></>}
                    <ul className="submenu">
                        <li onClick={() => setSubmenu("smartphones")}>
                            <Link className="nav-sub-link" to="/category/smartphones">Smartphones</Link>
                            {submenu === "smartphones" ? <hr /> : <></>}
                        </li>
                        <li onClick={() => setSubmenu("laptops")}>
                            <Link className="nav-sub-link" to="/category/laptops">Laptops</Link>
                            {submenu === "laptops" ? <hr /> : <></>}
                        </li>
                        <li onClick={() => setSubmenu("wearables")}>
                            <Link className="nav-sub-link" to="/category/wearables">Wearables</Link>
                            {submenu === "wearables" ? <hr /> : <></>}
                        </li>
                        <li onClick={() => setSubmenu("cameras")}>
                            <Link className="nav-sub-link" to="/category/cameras">Cameras</Link>
                            {submenu === "cameras" ? <hr /> : <></>}
                        </li>
                    </ul>
                </li>
                <li onClick={() => setMenu("about")}>
                    <Link className="nav-link" to="/about">About</Link>
                    {menu === "about" ? <hr /> : <></>}
                </li>
                <li onClick={() => setMenu("review")}>
                    <Link className="nav-link" to="/reviews">Reviews</Link>
                    {menu === "review" ? <hr /> : <></>}
                </li>
                <li onClick={() => setMenu("myacc")}>
                    <Link className="nav-link" to="/user/profile">My Account</Link>
                    {menu === "myacc" ? <hr /> : <></>}
                </li>
                <li onClick={() => setMenu("orderhistory")}>
                    <Link className="nav-link" to="/orderhistory">Order History</Link>
                    {menu === "orderhistory" ? <hr /> : <></>}
                </li>
            </ul>
            <div className="nav-login-cart">
                {/* Conditionally render Login or Logout based on the user status */}
                {!user ? (
                    <Link to='/login'><button>Login</button></Link>
                ) : (
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to logout?')) {
                                handleLogout();
                            }
                        }}
                    >
                        Logout
                    </button>
                )}
                <Link to='/cart'>
                    <img src={cart_icon} alt="Cart" />
                </Link>
            </div>

        </div>
    );
}

export default Navbar;
