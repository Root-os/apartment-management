import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddVehicleForm = () => {
  // Get the tenantId from the URL using React Router's useParams
  const { tenantId } = useParams();
  
  // State to manage the form data
  const [formData, setFormData] = useState({
    carPlate: '',
    carName: '',
    color: ''
  });

  // Loading state for form submission
  const [loading, setLoading] = useState(false);
  
  // State to display messages (success or error)
  const [message, setMessage] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    setMessage(null); // Reset previous messages

    try {
      // Send the POST request to add the vehicle, with tenantId passed in headers
      const response = await axios.post('{{local}}/api/tenant-vehicle/', {
        carPlate: formData.carPlate,
        carName: formData.carName,
        color: formData.color
      }, {
        headers: {
          'tenant-id': tenantId  // Pass tenantId via headers if needed
        }
      });

      setMessage(response.data.message); // Show success message
      setFormData({ carPlate: '', carName: '', color: '' }); // Reset form fields
    } catch (error) {
      // Handle any errors (e.g. invalid form data)
      setMessage(error.response?.data?.message || 'Error adding vehicle');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-4 border">
      <h2 className="text-xl font-bold text-gray-800">Add Vehicle</h2>
      
      {message && (
        <div className="text-sm text-center text-blue-600 font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Car Plate Input */}
        <input
          type="text"
          name="carPlate"
          placeholder="Car Plate"
          value={formData.carPlate}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        
        {/* Car Name Input */}
        <input
          type="text"
          name="carName"
          placeholder="Car Name"
          value={formData.carName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        
        {/* Car Color Input */}
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          {loading ? 'Submitting...' : 'Add Vehicle'}
        </button>
      </form>
    </div>
  );
};

export default AddVehicleForm;
