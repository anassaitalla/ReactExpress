import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardUser.css";
import Navbar from '../components/Navbar';

function DashboardUser() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/users/profile",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="user-info">
          <h2>User Information</h2>
          <p><strong>Full Name:</strong> {user.fullName}</p>
          <p><strong>Username:</strong> {user.userName}</p>
          <p><strong>Email:</strong> {user.mail}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </>
  );
}

export default DashboardUser;