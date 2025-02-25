import React, { lazy, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { themeChange } from 'theme-change';
import checkAuth from './app/auth';  // Import the simplified checkAuth function
import initializeApp from './app/init';

// Importing pages
const Layout = lazy(() => import('./containers/Layout'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Register = lazy(() => import('./pages/Register'));


// Initializing different libraries
initializeApp();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);  // Initially, null to show loading state
  const [loading, setLoading] = useState(true);  // Show loading state until authentication check is complete

  useEffect(() => {
    themeChange(false);

    // Check if the user is authenticated by checking the token stored in localStorage
    const token = checkAuth();  // This will return the token if available, or null
    if (token) {
      setIsAuthenticated(true);  // If token exists, set authenticated state to true
    } else {
      setIsAuthenticated(false);  // If no token, set authenticated state to false
    }

    setLoading(false);  // Once the token check is done, stop loading
  }, []);  // This effect runs only once on initial load, to check for token

  // Show a loading spinner while the authentication status is being checked
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or something else
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
       

        {/* Protected routes */}
        <Route
          path="/app/*"
          element={
            // isAuthenticated 
            true ? (
              <Layout />  // Protected route content
            ) : (
              <Navigate to="/login" replace />  // Redirect to login if not authenticated
            )
          }
        />

        {/* Catch-all route to ensure that all paths redirect based on authentication */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;