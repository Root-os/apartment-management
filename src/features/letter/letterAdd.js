import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal'

const AddLetterType = () => {
  // State variables for form inputs
  const [name, setName] = useState('');
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
    if (!name || !description) {
      setError('Both fields are required');
      return;
    }
  
    // Set loading state to true when sending the request
    setLoading(true);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}letter-type`, {
        name,
        description
      });
  
      setName('');
      setDescription('');
  
      setModalOpen(true);
      setMessageType('success');
      setMessage('Letter Type added successfully.');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
  
      if (error.response) {
        // Handle specific 400 error
        if (error.response.status === 400) {
          setMessage(error.response.data.message || 'Invalid input. Please try again.');
        } else {
          setMessage(`Error: ${error.response.data.message || 'Something went wrong.'}`);
        }
      } else if (error.request) {
        // Network error or no response received
        setMessage('No response from server. Please check your connection.');
      } else {
        // Other unexpected errors
        setMessage('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <TitleCard title="Add Letter Type" topMargin={'mt-1'}  >
      {/* Form to input Letter type data */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-white-700">Letter Type Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

export default AddLetterType;