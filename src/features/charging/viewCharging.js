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
  const [carPlate, setCarPlate] = useState('');
  const [carName, setCarName] = useState('');
  const [isTenant, setIsTenant] = useState(true);
  const [tenantId, setTenantId] = useState('');
  const [chargingStartTime, setChargingStartTime] = useState('');
  const [chargingEndTime, setChargingEndTime] = useState('');
  const [chargingCost, setChargingCost] = useState('');
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

  const handleEditClick = (charging) => {
    console.log('Edit Clicked:', charging);
    setSelectedCharging(charging);
    setCarPlate(charging.carPlate);
    setCarName(charging.carName);
    setIsTenant(charging.isTenant);
    setTenantId(charging.tenantId);
  
    // Ensure proper datetime-local format (YYYY-MM-DDTHH:MM)
    setChargingStartTime(charging.chargingStartTime 
      ? new Date(charging.chargingStartTime).toISOString().slice(0, 16) 
      : '');
    setChargingEndTime(charging.chargingEndTime 
      ? new Date(charging.chargingEndTime).toISOString().slice(0, 16) 
      : '');
    setChargingCost(charging.chargingCost);
    setStatus(charging.status);
    setIsEditModalOpen(true);
  };
  const handleDeleteClick = (charging) => {
    setSelectedCharging(charging);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedCharging = {
        carPlate,
        carName,
        isTenant,
        tenantId: Number(tenantId),
        // Convert to ISO string for API consistency
        chargingStartTime: chargingStartTime ? new Date(chargingStartTime).toISOString() : null,
        chargingEndTime: chargingEndTime ? new Date(chargingEndTime).toISOString() : null,
        chargingCost,
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
    { label: 'Car Plate', key: 'carPlate' },
    { label: 'Car Name', key: 'carName' },
    { label: 'Is Tenant', key: 'isTenant', render: (row) => (row.isTenant ? 'Yes' : 'No') },
    {
      label: 'Tenant Name',
      key: 'tenantId',
      render: (row) => {
        const tenant = tenants.find((tenant) => tenant.id === row.tenantId);
        return tenant ? tenant.fullName : 'N/A';
      },
    },
    {
      label: 'Charging Start Time',
      key: 'chargingStartTime',
      render: (row) => row.chargingStartTime
        ? new Date(row.chargingStartTime).toLocaleString() 
        : 'N/A',
    },
    {
      label: 'Charging End Time',
      key: 'chargingEndTime',
      render: (row) => row.chargingEndTime
        ? new Date(row.chargingEndTime).toLocaleString() 
        : 'N/A',
    },
    { label: 'Charging Cost', key: 'chargingCost' },
    { label: 'Status', key: 'status' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
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
                  Tenant Name
                </label>
                <select
                  id="tenantId"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isTenant}
                >
                  <option value="">Select Tenant</option>
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
                <label htmlFor="chargingCost" className="block text-sm font-medium text-white-700">
                  Charging Cost
                </label>
                <input
                  type="number"
                  id="chargingCost"
                  value={chargingCost}
                  onChange={(e) => setChargingCost(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-white-700">
                  Status
                </label>
                <input
                  type="text"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={loading}
                >
                  {loading ? 'saving...' : 'Save'}
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
