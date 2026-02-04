import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../utils/api';

const TenantVehicles = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    carPlate: '',
    carName: '',
    // color: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, [tenantId]);

  const fetchVehicles = async () => {
    try {
      const response = await api.get(`tenant-vehicle/vehicles/${tenantId}`);
      if (response.data.success) {
        setVehicles(response.data.vehicles);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      carPlate: vehicle.carPlate,
      carName: vehicle.carName,
      // color: vehicle.color
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await api.put(`tenant-vehicle/${selectedVehicle.id}`, {
        ...formData,
        tenantId: parseInt(tenantId)
      });

      if (response.data.success) {
        setModalOpen(false);
        toast.success('Updated successfully');
        fetchVehicles(); 
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (vehicleId) => {
    const confirmed = window.confirm("Are you sure you want to delete this vehicle?");
    if (!confirmed) return;
  
    try {
      const token = localStorage.getItem('token'); // or however you're storing the auth token
      await api.delete(`tenant-vehicle/${vehicleId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Vehicle deleted successfully!");
      fetchVehicles(); // Refresh list
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete vehicle.");
    }
  };
  


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tenant Vehicle Information</h1>

      <div className="flex justify-between items-center mb-6">
       
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : vehicles.length === 0 ? (
        <p>No vehicles found for this tenant.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-base-100 border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-base-100 text-left">
                <th className="py-2 px-4 border-b">Car Plate</th>
                <th className="py-2 px-4 border-b">Car Name</th>
                {/* <th className="py-2 px-4 border-b">Color</th> */}
                {/* <th className="py-2 px-4 border-b">Created At</th> */}
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="py-2 px-4 border-b">{vehicle.carPlate}</td>
                  <td className="py-2 px-4 border-b">{vehicle.carName}</td>
                  {/* <td className="py-2 px-4 border-b">{vehicle.color}</td> */}
                  {/* <td className="py-2 px-4 border-b">
                    {new Date(vehicle.createdAt).toLocaleDateString()}
                  </td> */}
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button
                      onClick={() => openEditModal(vehicle)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-base-100 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>

            <div className="mb-4">
              <label className="block mb-1">Car Plate</label>
              <input
                type="text"
                name="carPlate"
                value={formData.carPlate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded bg-base-100"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Car Name</label>
              <input
                type="text"
                name="carName"
                value={formData.carName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded bg-base-100"
              />
            </div>

            {/* <div className="mb-4">
              <label className="block mb-1">Color</label>
              <input
                type="text"
                name="color"
                
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded bg-base-100"
              />
            </div> */}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TenantVehicles;
