import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../../components/Cards/TitleCard';
import Modal from '../../../components/Modal'

const AddItemType = () => {
  // State variables for form inputs
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
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
    
    // Check if both fields are filled
    if (!categoryName || !description) {
      setError('Both fields are required');
      return;
    }

    // Set loading state to true when sending the request
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}item-types`, {
        categoryName,
        description
      });
      setCategoryName('');
      setDescription('');

      setModalOpen(true);
      setMessageType('success');
      setMessage('Item Type added successfully.');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add item type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Add Item Type"  >
      {/* Form to input item type data */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="typeName" className="block text-sm font-medium text-white-700">Item Type Name</label>
          <input
            type="text"
            id="typeName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            // placeholder="Enter type name"
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
            // placeholder="Enter description"
            required
          ></textarea>
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

export default AddItemType;
