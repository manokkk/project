import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminNavbar.css';
import navlogo from '../Assets/nav-logo.png';
import navProfile from '../Assets/nav-profile.png';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <div className="admin-navbar">
      <div className="admin-nav-logo">
        <img src={navlogo} alt="Logo" />
      </div>
      <div className="admin-nav-profile">
        <img src={navProfile} alt="Profile" />
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
