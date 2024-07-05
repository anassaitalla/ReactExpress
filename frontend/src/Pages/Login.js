import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // Make sure to create this CSS file

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/users/login",
        {
          userName: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Login successful", response.data);
      // Handle successful login
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during login");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back</h2>
        <p>Please login to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            <label htmlFor="password">Password</label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        
      </div>
    </div>
  );
}

export default Login;