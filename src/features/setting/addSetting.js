import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const SettingForm = () => {
  // Form state
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');

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
    if (!key.trim() || !value.trim() || !unit.trim() || !description.trim()) {
      setLoading(false);
      setModalOpen(true);
      setMessageType('error');
      setMessage('All fields are required');
      return;
    }

    const payload = {
      key,
      value,
      unit,
      description,
    };

    try {
      const response = await axios.post(
        'https://apartment.houseethiopia.com/api/setting',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setLoading(false);
      setModalOpen(true);
      setMessageType('success');
      setMessage('Setting added successfully');
      console.log('Setting added:', response.data);

      // Reset form after successful submission
      setKey('');
      setValue('');
      setUnit('');
      setDescription('');
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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="key" className="block text-sm font-medium text-white-700">
              Key
            </label>
            <input
              type="text"
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
              disabled={loading}
              className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="value" className="block text-sm font-medium text-white-700">
              Value
            </label>
            <input
              type="number" // Changed to text to match API example, can revert to number if needed
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              disabled={loading}
              className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="unit" className="block text-sm font-medium text-white-700">
              Unit
            </label>
            <input
              type="text"
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
              disabled={loading}
              className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-white-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
              className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
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