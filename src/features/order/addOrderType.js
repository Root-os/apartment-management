import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddOrderType = () => {
  // State variables for form inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages before submitting
    setMessage('');
    setError('');
    
    // Check if all fields are filled
    if (!name || !description || !price) {
      setError('All fields are required');
      return;
    }

    // Set loading state to true when sending the request
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}order-type`, {
        name,
        description,
        price: parseFloat(price)
      });
      setName('');
      setDescription('');
      setPrice('');

      setModalOpen(true);
      setMessageType('success');
      setMessage('Order Type added successfully.');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add order type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Add Order Type"  >
        {/* Form to input order type data */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-white-700">Order Type Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-white-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-white-700">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
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
    </>
  );
};

export default AddOrderType;