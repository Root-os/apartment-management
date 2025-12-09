import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const TenantLoginPage = () => {
  const [phoneNumberOrEmail, setPhoneNumberOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      password,
      ...(isEmail(phoneNumberOrEmail)
        ? { email: phoneNumberOrEmail }
        : { phoneNumber: phoneNumberOrEmail }),
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}tenant-auth/login`,
        payload,
        { timeout: 10000 }
      );

      if (response.data.success) {
        localStorage.removeItem('role');
        localStorage.setItem('token', response.data.token);
        const decodedToken = jwtDecode(response.data.token);
        localStorage.setItem('fullName', decodedToken.fullName);
        localStorage.setItem('role', decodedToken.role);
        localStorage.setItem('userId', decodedToken.id);
        window.location.href = '/app';
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
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(/gara.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 bg-white/20 backdrop-blur-md border border-white/30 p-8 rounded-2xl shadow-xl w-full max-w-sm text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Tenant Login</h2>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="phoneNumberOrEmail">
              Phone Number or Email
            </label>
            <input
              type="text"
              id="phoneNumberOrEmail"
              value={phoneNumberOrEmail}
              onChange={(e) => setPhoneNumberOrEmail(e.target.value)}
              required
              className="w-full p-3 bg-white/10 text-white placeholder-gray-300 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your phone number or email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-white/10 text-white placeholder-gray-300 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className={`w-full p-3 rounded-md text-white font-semibold transition duration-300 ${
              isLoading
                ? 'bg-indigo-500/60 cursor-not-allowed'
                : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
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
