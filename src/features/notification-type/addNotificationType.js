import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal'

const AddNotificationType = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token'); // Get token from localStorage

    const payload = {
      name,
    };

    try {
      const response = await axios.post('https://apartment.houseethiopia.com/api/notification-type', payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
    //   setMessage(`Success: ${response.data.message}`);
    setModalOpen(true);
    setMessageType('success');
    setMessage('Notification type added successfully');
      setName('');
    } catch (error) {
    //   setMessage(`Error: ${error.response?.data?.message || 'Something went wrong!'}`);
    setModalOpen(true);
    setMessageType('error');
    setMessage('Unable to add notification type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Add Notification Type">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block text-white-700" htmlFor="name">Notification Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded bg-base-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400"
          >
            {loading ? 'Submitting...' : 'Add Notification Type'}
          </button>
        </form>
        {/* {message && (
          <div className={`mt-4 p-2 rounded ${message.startsWith('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )} */}
      </TitleCard>
      <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      messageType={messageType}
      message={message}  
      />
    </>
  );
};

export default AddNotificationType;