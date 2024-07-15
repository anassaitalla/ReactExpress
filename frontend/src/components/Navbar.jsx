// Navbar.js

// Import necessary dependencies
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Navbar.module.css"; // Import CSS module
import logo from '../assets/logo.png'; // Import logo image

function Navbar() {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State for dropdown visibility
  const user = JSON.parse(localStorage.getItem("user")); // Get user data from localStorage

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      // Send logout request to the server
      await axios.post(
        "http://localhost:5000/users/logout",
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("user"); // Remove user data from localStorage
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Function to get the first letter of the user's name for the avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo and brand name */}
      <div className={styles.navbarBrand}>
        <img src={logo} alt="Logo" />
        <span>APPS</span>
      </div>
      
      {/* Right side of navbar */}
      <div className={styles.navbarRight}>
        {user ? (
          // If user is logged in, show avatar and dropdown
          <div className={styles.avatarContainer} onClick={toggleDropdown}>
            <div className={styles.avatar}>
              {getInitial(user.fullName)}
            </div>
            {/* Dropdown menu */}
            <div className={`${styles.dropdownMenu} ${isDropdownVisible ? styles.show : ''}`}>
              <div className={styles.dropdownItem}>
                <span>{user.fullName}</span>
              </div>
              {/* Social media links */}
              <div className={styles.dropdownItem}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </div>
              <div className={styles.dropdownItem}>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </div>
              {/* Logout button */}
              <div className={styles.dropdownItem}>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          // If user is not logged in, show login button
          <Link to="/login" className={styles.loginButton}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;