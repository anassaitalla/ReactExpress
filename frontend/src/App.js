// App.js

// Import necessary dependencies from React and react-router-dom
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // Import CSS styles
import Login from './Pages/Login'; // Import Login component
import DashboardUser from './Pages/DashboardUser'; // Import DashboardUser component

// Main App component
function App() {
  return (
    // Set up routing using BrowserRouter
    <Router>
      <div className="App">
        {/* Define routes using Routes component */}
        <Routes>
          {/* Route for the root path and /login, both render Login component */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* Route for /dashboard, renders DashboardUser component */}
          <Route path="/dashboard" element={<DashboardUser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; // Export the App component for use in other files