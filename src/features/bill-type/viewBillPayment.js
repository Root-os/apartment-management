import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';

const Form = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    typeName: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); 
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Type Name */}
      <div className="flex flex-col">
        <label htmlFor="typeName" className="text-sm font-medium text-gray-700">
          Bill Type Name
        </label>
        <input
          type="text"
          id="typeName"
          name="typeName"
          value={formData.typeName}
          onChange={handleInputChange}
          className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="4"
          className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

// Bill Payment Page Component
const BillPaymentPage = () => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  // Handle form submission and make POST request using Axios
  const handleFormSubmit = async (data) => {
    try {
      const response = await axios.post(
        'https://apartment.houseethiopia.com/api/bill-type',
        data
      );
      // Set the response data to display it
      setResponseData(response.data);
      setError(null);
    } catch (err) {
      // Handle any error that occurs during the POST request
      setError('An error occurred while adding the bill payment.');
      setResponseData(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Add a Bill Payment</h1>
      <Form onSubmit={handleFormSubmit} />

      {/* Display the response from the API */}
      {responseData && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-md">
          <h2 className="text-lg font-semibold">Bill Payment Added Successfully!</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}

      {/* Display error message if any */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded-md">
          <h2 className="text-lg font-semibold">Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default BillPaymentPage;
