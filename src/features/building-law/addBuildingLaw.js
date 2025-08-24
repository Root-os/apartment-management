import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';


const AddBuildingLaw = () => {
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); 

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
    <>
      
      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}
      
      <TitleCard title="Add Building Rule" topMargin={'mt-4'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white-600 font-medium mb-1">Description</label>
          <textarea
            className="w-full bg-base-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter the rule..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </form>
      </TitleCard>
      
    </>
  );
};

export default AddBuildingLaw;
