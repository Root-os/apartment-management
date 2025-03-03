import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const TenantLoginPage = () => {
  const [phoneNumberOrEmail, setPhoneNumberOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      phoneNumber: phoneNumberOrEmail, // Can use email or phoneNumber
      password: password,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}tenant-auth/login`, payload, {
        timeout: 10000, // Set timeout to 10 seconds
      });

      if (response.data.success) {
        // Store the token in localStorage
        localStorage.removeItem('token');
        
        localStorage.setItem('token', response.data.token);
        const decodedToken = jwtDecode(response.data.token);
        localStorage.setItem('fullName', decodedToken.fullName);
        localStorage.setItem('role', decodedToken.role);
        localStorage.setItem('userId', decodedToken.id);
        // Redirect or perform any action after successful login (e.g., navigate to dashboard)
        window.location.href = '/app'; // Example redirect
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error('Login Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Tenant Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="phoneNumberOrEmail">
              Phone Number or Email
            </label>
            <input
              type="text"
              id="phoneNumberOrEmail"
              value={phoneNumberOrEmail}
              onChange={(e) => setPhoneNumberOrEmail(e.target.value)}
              required
              className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your phone number or email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className={`w-full p-3 bg-blue-500 text-white rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TenantLoginPage;
