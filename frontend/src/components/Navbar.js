import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Navbar.module.css";
import logo from '../assets/logo.png';

function Navbar() {
  const navigate = useNavigate();
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

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
      <img src={logo} alt="Logo" />
        <span>APPS</span>
      </div>
      <ul className={styles.navbarNav}>
        {/* <li className={styles.navItem}>
          <Link to="/dashboard">Dashboard</Link>
        </li> */}
        {user && user.role === "admin" && (
          <li className={styles.navItem}>
            <Link to="/admin">Admin Panel</Link>
          </li>
        )}
      </ul>
      <div className={styles.navbarRight}>
        {user ? (
          <>
            <span className={styles.username}>Welcome, {user.fullName}</span>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </>
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
