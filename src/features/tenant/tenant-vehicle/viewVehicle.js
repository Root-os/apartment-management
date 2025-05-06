import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TenantVehicles = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tenant-vehicle/vehicles/${tenantId}`);
        if (response.data.success) {
          setVehicles(response.data.vehicles);
        } else {
          console.error('Failed to fetch vehicles');
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [tenantId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tenant Vehicle Information</h1>

      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Back
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : vehicles.length === 0 ? (
        <p>No vehicles found for this tenant.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border-b">Car Plate</th>
                <th className="py-2 px-4 border-b">Car Name</th>
                <th className="py-2 px-4 border-b">Color</th>
                <th className="py-2 px-4 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="py-2 px-4 border-b">{vehicle.carPlate}</td>
                  <td className="py-2 px-4 border-b">{vehicle.carName}</td>
                  <td className="py-2 px-4 border-b">{vehicle.color}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(vehicle.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenantVehicles;
