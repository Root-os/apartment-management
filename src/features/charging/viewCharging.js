import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const ChargingPage = () => {
  const [chargingData, setChargingData] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedCharging, setSelectedCharging] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // New state for detail modal
  const [carPlate, setCarPlate] = useState('');
  const [carName, setCarName] = useState('');
  const [isTenant, setIsTenant] = useState(true);
  const [tenantId, setTenantId] = useState('');
  const [chargingStartTime, setChargingStartTime] = useState('');
  const [chargingEndTime, setChargingEndTime] = useState('');
  const [chargingCost, setChargingCost] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const chargingApiUrl = `${process.env.REACT_APP_BASE_URL}charging`;
  const tenantApiUrl = `${process.env.REACT_APP_BASE_URL}tenant`;

  useEffect(() => {
    const fetchChargingData = async () => {
      try {
        const response = await axios.get(chargingApiUrl);
        setChargingData(response.data);
      } catch (error) {
        setError('Error fetching charging data');
      } finally {
        setPageLoading(false);
      }
    };

    const fetchTenants = async () => {
      try {
        const response = await axios.get(tenantApiUrl);
        setTenants(response.data);
      } catch (error) {
        setError('Error fetching tenant data');
      }
    };

    fetchChargingData();
    fetchTenants();
  }, []);

  // Helper function to format date to local time for datetime-local input
  const formatToLocalDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localDate = new Date(date.getTime() - offset); // Adjust to local time
    return localDate.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm
  };

  const handleEditClick = (charging) => {
    setSelectedCharging(charging);
    setCarPlate(charging.carPlate);
    setCarName(charging.carName);
    setChargingStartTime(formatToLocalDateTime(charging.chargingStartTime));
    setChargingEndTime(formatToLocalDateTime(charging.chargingEndTime));
    setChargingCost(charging.chargingCost);
    setStatus(charging.status);
    setIsTenant(charging.isTenant); // Set tenant status based on data
    setTenantId(charging.tenantId || ''); // Ensure it's either an empty string or a valid tenant ID
  
    // If tenant exists and has a car, autofill the car details
    if (charging.isTenant && charging.tenantId) {
      const tenant = tenants.find((tenant) => tenant.id === charging.tenantId);
      if (tenant && tenant.TenantVehicles && tenant.TenantVehicles.length > 0) {
        const tenantCar = tenant.TenantVehicles[0]; // Assuming the first car
        setCarPlate(tenantCar.carPlate || '');
        setCarName(tenantCar.carName || '');
      }
    }
  
    setIsEditModalOpen(true);
  };
  
  // Handle tenant change in the edit form
  const handleTenantChange = (e) => {
    const selectedTenantId = e.target.value;
    console.log("Selected Tenant ID:", selectedTenantId);  // Log selected tenant ID
    setTenantId(selectedTenantId);
  
    // Reset car details if tenant is changed
    setCarPlate('');
    setCarName('');
  
    const selectedTenant = tenants.find((tenant) => tenant.id === Number(selectedTenantId));  // Log selected tenant
    if (selectedTenant) {
      console.log("Selected Tenant:", selectedTenant);  // Log selected tenant
      // If the tenant has vehicles, auto-fill the car details
      if (selectedTenant.TenantVehicles && selectedTenant.TenantVehicles.length > 0) {
        const tenantCar = selectedTenant.TenantVehicles[0];  // Get the first car
        setCarPlate(tenantCar.carPlate || '');
        setCarName(tenantCar.carName || '');
      }
    } else {
      console.error("Tenant not found");
    }
  };
  
  

  const handleDeleteClick = (charging) => {
    setSelectedCharging(charging);
    setIsDeleteModalOpen(true);
  };

  const handleDetailClick = (charging) => {
    setSelectedCharging(charging);
    setIsDetailModalOpen(true);
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedCharging = {
        carPlate,
        carName,
        isTenant,
        tenantId: Number(tenantId),
        chargingStartTime: chargingStartTime ? new Date(chargingStartTime).toISOString() : null,
        chargingEndTime: chargingEndTime ? new Date(chargingEndTime).toISOString() : null,
        status,
      };

      console.log('Updating Charging Data:', updatedCharging);

      const response = await axios.put(`${chargingApiUrl}/${selectedCharging.id}`, updatedCharging);
      const updatedData = chargingData.map((charging) =>
        charging.id === selectedCharging.id ? response.data : charging
      );
      setChargingData(updatedData);
      setIsEditModalOpen(false);
      setSelectedCharging(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Charging data updated successfully');
    } catch (error) {
      setMessageType('error');
      setMessage('Unable to update charging data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${chargingApiUrl}/${selectedCharging.id}`);
      setChargingData(chargingData.filter((charging) => charging.id !== selectedCharging.id));
      setIsDeleteModalOpen(false);
      setSelectedCharging(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Charging data deleted successfully');
    } catch (error) {
      setMessageType('error');
      setMessage('Unable to delete charging data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    // { label: 'Car Plate', key: 'carPlate' },
    // { label: 'Car Name', key: 'carName' },
    // { label: 'Is Tenant', key: 'isTenant', render: (row) => (row.isTenant ? 'Yes' : 'No') },
    {
      label: 'Tenant Name',
      key: 'tenantId',
      render: (row) => {
        const tenant = tenants.find((tenant) => tenant.id === row.tenantId);
        return tenant ? tenant.fullName : 'N/A';
      },
    },
    // {
    //   label: 'Charging Start Time',
    //   key: 'chargingStartTime',
    //   render: (row) => row.chargingStartTime
    //     ? new Date(row.chargingStartTime).toLocaleString()
    //     : 'N/A',
    // },
    // {
    //   label: 'Charging End Time',
    //   key: 'chargingEndTime',
    //   render: (row) => row.chargingEndTime
    //     ? new Date(row.chargingEndTime).toLocaleString()
    //     : 'N/A',
    // },
    {
      label: 'Charging Cost',
      key: 'chargingCost',
      render: (row) => row.chargingCost != null ? row.chargingCost : 'N/A',
    },
    { label: 'Status', key: 'status' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={() => handleDetailClick(row)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Detail
          </button>
        </div>
      ),
    },
  ];

  if (error) {
    return <div>{error}</div>;
  }

  const handleAddClick = () => {
    window.location.href = '/app/charging-add';
  };

  return (
    <div>
      {pageLoading ? (
        <LoadingComponent />
      ) : (
        <TableComponent
          title="Charging Information"
          data={chargingData}
          columns={columns}
          showSearch={true}
          exportable={true}
          onAdd={handleAddClick}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
          <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Charging Data</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="carPlate" className="block text-sm font-medium text-white-700">
                  Car Plate
                </label>
                <input
                  type="text"
                  id="carPlate"
                  value={carPlate}
                  onChange={(e) => setCarPlate(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="carName" className="block text-sm font-medium text-white-700">
                  Car Name
                </label>
                <input
                  type="text"
                  id="carName"
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="isTenant" className="block text-sm font-medium text-white-700">
                  Is Tenant
                </label>
                <input
                  type="checkbox"
                  id="isTenant"
                  checked={isTenant}
                  onChange={(e) => setIsTenant(e.target.checked)}
                  className="mt-1 bg-base-100 block"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="tenantId" className="block text-sm font-medium text-white-700">
                  Select Tenant
                </label>
                <select
                  id="tenantId"
                  value={tenantId}  // Set the selected tenant ID
                  onChange={handleTenantChange}  // Trigger the tenant change handler
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isTenant}  // Disable the field if isTenant is false
                >
                  <option value="">Select a tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="chargingStartTime" className="block text-sm font-medium text-white-700">
                  Charging Start Time
                </label>
                <input
                  type="datetime-local"
                  id="chargingStartTime"
                  value={chargingStartTime}
                  onChange={(e) => setChargingStartTime(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label htmlFor="chargingEndTime" className="block text-sm font-medium text-white-700">
                  Charging End Time
                </label>
                <input
                  type="datetime-local"
                  id="chargingEndTime"
                  value={chargingEndTime}
                  onChange={(e) => setChargingEndTime(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-white-700">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="charging">Charging</option>
                  <option value="completed">completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this charging data?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedCharging && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
          <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Charging Details</h2>
            <div className="mb-4 space-y-2">
              <p><strong>Car Plate:</strong> {selectedCharging.carPlate}</p>
              <p><strong>Car Name:</strong> {selectedCharging.carName}</p>
              <p><strong>Is Tenant:</strong> {selectedCharging.isTenant ? 'Yes' : 'No'}</p>
              <p>
                <strong>Tenant Name:</strong>{' '}
                {tenants.find((tenant) => tenant.id === selectedCharging.tenantId)?.fullName || 'N/A'}
              </p>
              <p>
                <strong>Charging Start Time:</strong>{' '}
                {selectedCharging.chargingStartTime
                  ? new Date(selectedCharging.chargingStartTime).toLocaleString()
                  : 'N/A'}
              </p>
              <p>
                <strong>Charging End Time:</strong>{' '}
                {selectedCharging.chargingEndTime
                  ? new Date(selectedCharging.chargingEndTime).toLocaleString()
                  : 'N/A'}
              </p>
              <p>
                <strong>Charging Cost:</strong>{' '}
                {selectedCharging.chargingCost != null ? selectedCharging.chargingCost : 'N/A'}
              </p>
              <p><strong>Status:</strong> {selectedCharging.status}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default ChargingPage;