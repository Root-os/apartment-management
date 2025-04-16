import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal'; 
import TitleCard from '../../components/Cards/TitleCard';

const RegisterUserPage = () => {
  // State variables
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success' | 'error' | 'warning'

  const token = localStorage.getItem('token'); // Token for authenticated requests

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(response.data); // Set roles in the state
      } catch (error) {
        setModalType('error');
        setModalMessage('Failed to load roles');
        setModalOpen(true);
      }
    };

    fetchRoles();
  }, [token]);

  const handleCloseModal = () => setModalOpen(false);

  // Validate form before submission
  const validateForm = () => {
    if (!fname || !lname || !email || !phone || !password || !roleId) {
      setModalType('warning');
      setModalMessage('All fields are required!');
      setModalOpen(true);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setModalType('warning');
      setModalMessage('Please enter a valid email address!');
      setModalOpen(true);
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setModalType('warning');
      setModalMessage('Please enter a valid phone number!');
      setModalOpen(true);
      return false;
    }

    return true;
  };

  // Handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; 

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}auth/register`,
        {
          fname,
          lname,
          email,
          phone,
          password,
          roleId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModalType('success');
      setModalMessage(response.data.message || 'User registered successfully!');
      setModalOpen(true);
      // Clear the form after success
      setFname('');
      setLname('');
      setEmail('');
      setPhone('');
      setPassword('');
      setRoleId('');
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'An error occurred while registering the user.';
      setModalType('error');
      setModalMessage(errMsg);
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
     <TitleCard title={"User Registration Form"} topMargin={"mt-1"}> 
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label htmlFor="fname" className="block text-sm font-medium text-gray-700 dark:text-gray-200">First Name</label>
          <input
            type="text"
            id="fname"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            className="bg-base-100 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter first name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lname" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Last Name</label>
          <input
            type="text"
            id="lname"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            className="bg-base-100 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter last name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-base-100 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-base-100 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-base-100 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Select Role</label>
          <select
            id="roleId"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="bg-base-100 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 w-full py-2 px-4 text-white rounded-md transition-all ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Registering...' : 'Register User'}
        </button>
      </form>
      </TitleCard> 

      {/* Modal Integration */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        messageType={modalType}
        message={modalMessage}
      />
    </div>
  );
};

export default RegisterUserPage;
