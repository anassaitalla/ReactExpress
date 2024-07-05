import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardUser.css";

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
        // console.log('User data received:', response.data.user);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/users/logout",
        {},
        {
          withCredentials: true,
        }
      );
      // Clear user data from local storage
      localStorage.removeItem("user");
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.fullName}</h1>
      <div className="user-info">
        <p>
          <strong>Username:</strong> {user.userName}
        </p>
        <p>
          <strong>Email:</strong> {user.mail}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default DashboardUser;
