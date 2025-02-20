import React, { useState } from 'react';
import axios from 'axios';

const AddExpense = () => {
  const [name, setName] = useState(''); // Expense name
  const [description, setDescription] = useState(''); // Expense description
  const [loading, setLoading] = useState(false); // To track loading state
  const [error, setError] = useState(null); // To handle error state
  const [successMessage, setSuccessMessage] = useState(null); // To display success message

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Simple validation
    if (!name || !description) {
      setError('Both name and description are required.');
      return;
    }

    setLoading(true); // Set loading state to true while sending the request
    setError(null); // Reset error message
    setSuccessMessage(null); // Reset success message

    // Send the POST request to the API
    try {
      const response = await axios.post('https://apartment.houseethiopia.com/api/expense-type', {
        name,
        description,
      });
      
      // On successful response, display success message
      setSuccessMessage('Expense added successfully!');
      setName(''); // Clear the form fields
      setDescription('');
      window.location.href='/app/expense-view'
    } catch (err) {
      setError('An error occurred while adding the expense.');
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Add Expense</h1>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 border border-red-400 rounded-md">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 mb-6 bg-green-100 text-green-700 border border-green-400 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Expense Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white-700" htmlFor="name">Expense Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-base-300"
            required
          />
        </div>

        <div>
          <label className="block text-white-700" htmlFor="description">Expense Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-base-300"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500"
            disabled={loading}
          >
            {loading ? 'Adding Expense...' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
