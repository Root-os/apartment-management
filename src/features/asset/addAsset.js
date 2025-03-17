import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';

const AddAsset = () => {
  // State for form input and response message
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    // Reset messages before submitting
    setSuccessMessage('');
    setErrorMessage('');

    // Prepare the payload
    const assetData = {
      name,
      description,
    };

    try {
      // Send POST request to the API
      const response = await axios.post('http://127.0.0.1:3000/api/asset', assetData);

      if (response.data.success) {
        setSuccessMessage(`Asset added successfully: ${response.data.data.name}`);
        setName('');  // Reset name input field
        setDescription('');  // Reset description input field
      }
    } catch (error) {
      setErrorMessage('Error adding asset. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <>

      {successMessage && (
        <div className="text-green-500 text-center mb-4">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="text-red-500 text-center mb-4">{errorMessage}</div>
      )}
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
          >
            Add Asset
          </button>
        </div>
      </form>
    </TitleCard>
    </>
  );
};

export default AddAsset;
