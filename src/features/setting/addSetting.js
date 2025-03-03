import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const SettingForm = () => {
  // State to hold the form values
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');

  // State to track the loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('')

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload = {
      key,
      value,
      unit,
      description,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}setting`, payload);
      setLoading(false);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Setting added successfully');
      setSuccess(true);
      console.log('Setting added:', response.data);

      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add setting');
    } catch (error) {
      setLoading(false);
      setError('Failed to add setting. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <TitleCard title="Add Setting">

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="key" className="block text-sm font-medium text-white-700">Key</label>
          <input
            type="text"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="value" className="block text-sm font-medium text-white-700">Value</label>
          <input
            type="number"
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="unit" className="block text-sm font-medium text-white-700">Unit</label>
          <input
            type="text"
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
            className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-white-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="bg-base-100 mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-center items-center space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
          >
            {loading ? 'Adding...' : 'Add Setting'}
          </button>
        </div>
      </form>
      </TitleCard>

      <Modal 
      isOpen={modalOpen}
      onClose={()=> setModalOpen(false)}
      messageType={messageType}
      message={message}
      />
    </div>
  );
};

export default SettingForm;
