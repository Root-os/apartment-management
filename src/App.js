import React, { lazy, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { themeChange } from 'theme-change';
import checkAuth from './app/auth';  
import initializeApp from './app/init';
import LoadingComponent from '../src/components/loading';

const Layout = lazy(() => import('./containers/Layout'));
const Login = lazy(() => import('./pages/Login'));

const TenantLogin = lazy(() => import('./pages/TenantLogin'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Register = lazy(() => import('./pages/Register'));


initializeApp();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);  
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    themeChange(false);

    const token = checkAuth();  
    if (token) {
      setIsAuthenticated(true);  
    } else {
      setIsAuthenticated(false);  
    }

    setLoading(false);  
  }, []);  

  if (loading) {
    return <LoadingComponent/>; 
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        <Route path="/tenant-login" element={<TenantLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
       

        {/* Protected routes */}
        <Route
          path="/app/*"
          element={
            isAuthenticated 
             ? (
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