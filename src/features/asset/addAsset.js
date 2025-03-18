import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';  

const AddAsset = () => {
  // State for form input, loading, and response messages
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state for the button
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [modalType, setModalType] = useState(''); // Modal type: 'success' or 'error'
  const [modalMessage, setModalMessage] = useState(''); // Modal message

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    // Reset messages before submitting
    setSuccessMessage('');
    setErrorMessage('');
    setLoading(true);  // Set loading to true

    // Prepare the payload
    const assetData = {
      name,
      description,
    };

    try {
      // Send POST request to the API
      const response = await axios.post(`http://127.0.0.1:3000/api/asset`, assetData);

      if (response.data.success) {
        setSuccessMessage(`Asset added successfully: ${response.data.data.name}`);
        setName('');  // Reset name input field
        setDescription('');  // Reset description input field
        setModalType('success'); // Set modal type to success
        setModalMessage(`Asset added successfully: ${response.data.data.name}`); // Success message
      }
    } catch (error) {
      setErrorMessage('Error adding asset. Please try again.');
      setModalType('error'); // Set modal type to error
      setModalMessage('Error adding asset. Please try again.'); // Error message
    } finally {
      setLoading(false);  // Set loading to false after the request is complete
      setModalOpen(true);  // Open the modal after submission
    }
  };

  const closeModal = () => {
    setModalOpen(false);  // Close the modal
  };

  return (
    <>
      <TitleCard title="Add Asset" topMargin={"mt-1"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white-700">Asset Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 bg-base-100 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 bg-base-100 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full px-6 py-3 mt-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}  // Disable button while loading
            >
              {loading ? (
                
                 
                  'Saving...'
                
              ) : (
                'Add Asset'
              )}
            </button>
          </div>
        </form>
      </TitleCard>

      {/* Modal for success/error */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        messageType={modalType} 
        message={modalMessage}  
      />
    </>
  );
};

export default AddAsset;
