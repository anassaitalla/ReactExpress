import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Navbar.module.css";
import logo from '../assets/logo.png';

function Navbar() {
  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/users/logout",
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <img src={logo} alt="Logo" />
        <span>APPS</span>
      </div>
      {/* <ul className={styles.navbarNav}>
        {user && user.role === "admin" && (
          <li className={styles.navItem}>
            <Link to="/admin">Admin Panel</Link>
          </li>
        )}
      </ul> */}
      <div className={styles.navbarRight}>
        {user ? (
          <div className={styles.avatarContainer} onClick={toggleDropdown}>
            <div className={styles.avatar}>
              {getInitial(user.fullName)}
            </div>
            <div className={`${styles.dropdownMenu} ${isDropdownVisible ? styles.show : ''}`}>
              <div className={styles.dropdownItem}>
                <span>{user.fullName}</span>
              </div>
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
              <div className={styles.dropdownItem}>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/login" className={styles.loginButton}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
