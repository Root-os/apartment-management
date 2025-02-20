import React from 'react';
import { Navigate } from 'react-router-dom';
import checkAuth from './app/auth';  // Make sure this checks authentication status

const ProtectedRoute = ({ element }) => {
  const token = checkAuth();  // Check for token in localStorage or use your method to check authentication
  
  if (!token) {
    return <Navigate to="/login" replace />;  // Redirect to login if not authenticated
  }

  return element;  // Return the protected element if authenticated
};

export default ProtectedRoute;
