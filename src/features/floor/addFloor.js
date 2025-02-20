import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const FloorForm = () => {
  const [loading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    floorNumber: '',
    noUnits: '',
    status: 'available', 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
         setIsLoading(true);

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}floor`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setFormData({
        floorNumber: '',
        noUnits: '',
        status: 'available',
      });

      setModalOpen(true);
      setMessageType('success');  
      setMessage('Floor added successfully');
       setTimeout(() => {
     window.location.href = '/app/floor-view';}, 2000);
    } catch (error) {
      console.error('Error adding floor data:', error);
      alert('There was an error adding the floor data.');

      setModalOpen(true);
      setMessageType('error');
      setMessage('Failed to add floor');
    }finally
    {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Add Floor" topMargin={"mt-4"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="flex flex-col">
          <label htmlFor="floorNumber" className="text-sm font-medium text-gray-700">Floor Number</label>
          <input
            type="text"
            id="floorNumber"
            name="floorNumber"
            value={formData.floorNumber}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Number of Units */}
        <div className="flex flex-col">
          <label htmlFor="noUnits" className="text-sm font-medium text-gray-700">Number of Units</label>
          <input
            type="number"
            id="noUnits"
            name="noUnits"
            value={formData.noUnits}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="available">Available</option>
            <option value="unavailable">Occupied</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-4 py-2 w-1/2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? 'Submmiting...' : 'Add Floor'}
          </button>
        </div>
      </form>
       </TitleCard> 

       <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        type={messageType} 
        message={message} 
      />
   </>
  );
};

export default FloorForm;
