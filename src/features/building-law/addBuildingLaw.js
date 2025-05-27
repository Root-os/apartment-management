import React, { useState } from 'react';
import axios from 'axios';

const AddBuildingLaw = () => {
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setStatus('error');
      setMessage('Description is required.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}building-law`, { description });

      setStatus('success');
      setMessage(response.data.message || 'Rule added successfully!');
      setDescription('');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Failed to add rule.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add Building Rule</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter the rule description..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddBuildingLaw;
