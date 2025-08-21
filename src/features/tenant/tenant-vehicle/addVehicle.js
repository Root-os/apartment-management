import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import TitleCard from '../../../components/Cards/TitleCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowLeft } from 'lucide-react'; // or any icon lib you use


const AddVehicleForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tenantId = location.state?.tenantId;

  const [formData, setFormData] = useState({
    carPlate: '',
    carName: '',
    color: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!tenantId) {
      toast.error('Tenant ID missing. Cannot add vehicle.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}tenant-vehicle/`, {
        tenantId,
        carPlate: formData.carPlate,
        carName: formData.carName,
        color: formData.color
      });

      toast.success(response.data.message || 'Vehicle added successfully');
      setFormData({ carPlate: '', carName: '', color: '' });

      // Redirect after short delay
      setTimeout(() => {
        navigate(`/app/tenant/${tenantId}/vehicles`);
      }, 1500);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      <ToastContainer position="top-left" autoClose={3000} hideProgressBar />
      <TitleCard title="Add Vehicle" topMargin="mt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Car Plate */}
          <div>
            <label htmlFor="carPlate" className="block text-sm font-medium">
              Car Plate
            </label>
            <input
              type="text"
              name="carPlate"
              id="carPlate"
              placeholder="Car Plate"
              value={formData.carPlate}
              onChange={handleChange}
              className="bg-base-100 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Car Name */}
          <div>
            <label htmlFor="carName" className="block text-sm font-medium">
              Car Name
            </label>
            <input
              type="text"
              name="carName"
              id="carName"
              placeholder="Car Name"
              value={formData.carName}
              onChange={handleChange}
              className="bg-base-100 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Color */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium ">
              Color
            </label>
            <input
              type="text"
              name="color"
              id="color"
              placeholder="Color"
              value={formData.color}
              onChange={handleChange}
              className="bg-base-100 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            {loading ? 'Submitting...' : 'Add Vehicle'}
          </button>
        </form>
      </TitleCard>
    </>
  );
};

export default AddVehicleForm;
