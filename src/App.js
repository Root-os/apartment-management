import React, { lazy, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { themeChange } from 'theme-change';
import checkAuth from './app/auth';  
import initializeApp from './app/init';
import LoadingComponent from '../src/components/loading';
import Choice from '../src/components/choice'

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
  const role=localStorage.getItem('role');

  return (
    <Router>
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Choice />} />
    <Route path="/login" element={<Login />} />
    <Route path="/tenant-login" element={<TenantLogin />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/register" element={<Register />} />

    {/* Protected route */}
    <Route
      path="/app/*"
      element={
        isAuthenticated ? (
          <Layout />
        ) : role ? (
          role === 'tenant'
            ? <Navigate to="/tenant-login" replace />
            : <Navigate to="/login" replace />
        ) : (
          <Choice />
        )
      }
    />

    {/* Catch-all route */}
    <Route
      path="*"
      element={
        role ? (
          role === 'tenant'
            ? <Navigate to="/tenant-login" replace />
            : <Navigate to="/login" replace />
        ) : (
          <Choice />
        )
      }
    />
  </Routes>
</Router>
 
  );
}

export default App;