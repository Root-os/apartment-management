import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const ChargingReport = () => {
  const [chargingData, setChargingData] = useState([]); // Store charging data
  const [tenantList, setTenantList] = useState([]); // Store list of tenants
  const [filterParams, setFilterParams] = useState({
    carPlate: '',
    carName: '',
    isTenant: false,
    tenantId: '',  // This will be updated with selected tenant ID
    chargingStartTime: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tenant list on component mount
  useEffect(() => {
    const fetchTenantList = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant`); // Assuming this API endpoint exists
        setTenantList(response.data); 
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching tenant list:', error);
      }
    };

    fetchTenantList();
  }, []);

  // Handle filter submit
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}charging/report`, filterParams);

      // Log response data for debugging
      console.log('API response:', response.data);

      // Ensure the response is an array, otherwise set it to an empty array
      const data = Array.isArray(response.data) ? response.data : [];
      setChargingData(data);
    } catch (error) {
      const message = error.response?.status === 404
        ? 'No charging data found with the given filters.'
        : 'Error filtering data. Please try again.';
      setModalMessage(message);
      setIsModalOpen(true);
      console.error('Error filtering data:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const columns = [
    { key: 'carPlate', label: 'Car Plate' },
    { key: 'carName', label: 'Car Name' },
    { key: 'chargingStartTime', label: 'Charging Start Time', render: (data) => new Date(data.chargingStartTime).toLocaleString() },
    { key: 'status', label: 'Status' },
    { key: 'chargingCost', label: 'Charging Cost' },
  ];

  return (
    <div className="p-8">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Charging Report</h2>

        {/* Filter form */}
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-4 gap-4">
          {/* Car Plate */}
          <div>
            <label htmlFor="carPlate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Car Plate</label>
            <input
              type="text"
              id="carPlate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.carPlate}
              onChange={(e) => setFilterParams({ ...filterParams, carPlate: e.target.value })}
            />
          </div>

          {/* Car Name */}
          <div>
            <label htmlFor="carName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Car Name</label>
            <input
              type="text"
              id="carName"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.carName}
              onChange={(e) => setFilterParams({ ...filterParams, carName: e.target.value })}
            />
          </div>

          {/* Tenant Dropdown */}
          <div>
            <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tenant</label>
            <select
              id="tenantId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.tenantId}
              onChange={(e) => setFilterParams({ ...filterParams, tenantId: e.target.value })}
            >
              <option value="">Select Tenant</option>
              {tenantList.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Charging Start Time */}
          <div>
            <label htmlFor="chargingStartTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Charging Start Time</label>
            <input
              type="datetime-local"
              id="chargingStartTime"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.chargingStartTime}
              onChange={(e) => setFilterParams({ ...filterParams, chargingStartTime: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-4 flex justify-end">
            <button
              type="submit"
              className="w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:text-gray-300"
            >
              {isLoading ? 'Processing...' : 'Filter Data'}
            </button>
          </div>
        </form>
      </div>

      {/* Table for displaying charging report */}
      <TableComponent
        title="Filtered Charging Report"
        data={chargingData || []}  // Ensure the data is always an array
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      />

      {/* Modal for displaying error message */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type="error"
          message={modalMessage}
        />
      )}
    </div>
  );
};

export default ChargingReport;
