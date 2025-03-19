import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const SettingForm = () => {
  // Form state
  const [buildingName, setBuildingName] = useState('');
  const [buildingAddress, setBuildingAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postOfficeAddress, setPostOfficeAddress] = useState('');
  const [logos, setLogos] = useState(null);  
  const [seal, setSeal] = useState(null);    

  // UI state
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs
    if (
      !buildingName.trim() ||
      !buildingAddress.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !postOfficeAddress.trim() ||
      !logos ||
      !seal
    ) {
      setLoading(false);
      setModalOpen(true);
      setMessageType('error');
      setMessage('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('buildingName', buildingName);
    formData.append('buildingAddress', buildingAddress);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('postOfficeAddress', postOfficeAddress);
    formData.append('logos', logos);
    formData.append('seal', seal);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}setting`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      setModalOpen(true);
      setMessageType('success');
      setMessage('Setting added successfully');
      console.log('Setting added:', response.data);

      // Reset form after successful submission
      setBuildingName('');
      setBuildingAddress('');
      setEmail('');
      setPhoneNumber('');
      setPostOfficeAddress('');
      setLogos(null);
      setSeal(null);
    } catch (error) {
      setLoading(false);
      setModalOpen(true);
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Unable to add setting');
      console.error('Error adding setting:', error);
    }
  };

  return (
    <div>
      <TitleCard title="Add Setting" topMargin={'mt-1'}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="buildingName" className="block text-sm font-medium text-white-700">
              Building Name
            </label>
            <input
              type="text"
              id="buildingName"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              required
              disabled={loading}
              className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="buildingAddress" className="block text-sm font-medium text-white-700">
              Building Address
            </label>
            <input
              type="text"
              id="buildingAddress"
              value={buildingAddress}
              onChange={(e) => setBuildingAddress(e.target.value)}
              required
              disabled={loading}
              className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-white-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={loading}
              className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="postOfficeAddress" className="block text-sm font-medium text-white-700">
              Post Office Address
            </label>
            <input
              type="text"
              id="postOfficeAddress"
              value={postOfficeAddress}
              onChange={(e) => setPostOfficeAddress(e.target.value)}
              required
              disabled={loading}
              className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="logos" className="block text-sm font-medium text-white-700">
              Logo (Upload)
            </label>
            <input
              type="file"
              id="logos"
              onChange={(e) => setLogos(e.target.files[0])}
              required
              disabled={loading}
              className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="seal" className="block text-sm font-medium text-white-700">
              Seal (Upload)
            </label>
            <input
              type="file"
              id="seal"
              onChange={(e) => setSeal(e.target.files[0])}
              required
              disabled={loading}
              className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Setting'}
            </button>
          </div>
        </form>
      </TitleCard>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default SettingForm;
