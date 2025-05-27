import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table'; 
import Modal from '../../components/Modal'; 
import LoadingComponent from '../../components/loading';

// Utility function to format ISO date strings into human-readable format
const formatDate = (isoDateString) => {
  if (!isoDateString) return 'N/A'; // Handle null or undefined dates
  const date = new Date(isoDateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

// Utility function to convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
const formatForDateTimeLocal = (isoDateString) => {
  if (!isoDateString) return ''; // Return empty string for null/undefined
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const ParkingPage = () => {
  const [parkingData, setParkingData] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [carPlate, setCarPlate] = useState('');
  const [carName, setCarName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const [isTenant, setIsTenant] = useState(false); // For checkbox
  const [tenantList, setTenantList] = useState([]); // For storing tenant list
  const [tenantId, setTenantId] = useState(''); // For storing selected tenant ID

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedParkingDetails, setSelectedParkingDetails] = useState(null);


  // Fetch the parking data from the API
  useEffect(() => {
    setPageLoading(true);
    const fetchParkingData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}parking`);
        setParkingData(response.data);
      } catch (error) {
        console.error('Error fetching parking data:', error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchParkingData();
  }, []);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const url = `${process.env.REACT_APP_BASE_URL}tenant`;
        console.log("Fetching tenants from URL:", url); // Log the URL for debugging
        const response = await axios.get(url);
        setTenantList(response.data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }
    };
    fetchTenants();
  }, []);
  

  const handleTenantCheckboxChange = (e) => {
    setIsTenant(e.target.checked);
  };


  const handleEditClick = (parking) => {
    setSelectedParking(parking);
    setCarPlate(parking.carPlate);
    setCarName(parking.carName);
    setDriverName(parking.driverName);
    setDriverPhone(parking.driverPhone);
    setTimeIn(parking.timeIn);
    setTimeOut(parking.timeOut);
    setPrice(parking.price);
    setStatus(parking.status);
    setIsTenant(parking.isTenant);  // Set tenant status based on data
    setTenantId(parking.tenantId || '');  // Ensure it's either an empty string or a valid tenant ID
  
    // If tenant exists and has a car, auto-fill the car details
    if (parking.isTenant && parking.tenantId) {
      const tenant = tenantList.find((tenant) => tenant.id === parking.tenantId);
      if (tenant && tenant.TenantVehicles && tenant.TenantVehicles.length > 0) {
        const tenantCar = tenant.TenantVehicles[0]; // Assuming the first car
        setCarPlate(tenantCar.carPlate || '');
        setCarName(tenantCar.carName || '');
      }
    }
  
    setIsEditModalOpen(true);
  };
  
  // Handle tenant change
  const handleTenantChange = (e) => {
    const selectedTenantId = e.target.value;
    console.log("Selected Tenant ID:", selectedTenantId);  // Log selected tenant ID
    setTenantId(selectedTenantId);
  
    // Reset car details if tenant is changed
    setCarPlate('');
    setCarName('');
  
    
    const selectedTenant = tenantList.find((tenant) => tenant.id === Number(selectedTenantId));  // Log selected tenant
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
  
  // Handle delete button click
  const handleDeleteClick = (parking) => {
    setSelectedParking(parking);
    setIsDeleteModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedParking = {
        carPlate,
        carName,
        driverName,
        driverPhone,
        timeIn,
        timeOut,
        price,
        status,
        isTenant,
        tenantId: isTenant ? tenantId : null,
      };

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}parking/${selectedParking.id}`, updatedParking);
      console.log('Updated parking response:', response.data);

      // Update parkingData with a new array reference
      const updatedParkingData = parkingData.map((parking) =>
        parking.id === selectedParking.id ? { ...response.data } : { ...parking }
      );
      setParkingData([...updatedParkingData]);

      setIsEditModalOpen(false);
      setSelectedParking(null);
      setModalOpen(true);
      setMessageType('success');
      setMessage('Parking data updated successfully');
    } catch (error) {
      console.error('Error updating parking:', error);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update parking data');
    } finally {
      setLoading(false);
    }
  };


  // Handle delete request
  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}parking/${selectedParking.id}`);
      setParkingData(parkingData.filter((parking) => parking.id !== selectedParking.id));
      setIsDeleteModalOpen(false);
      setSelectedParking(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Parking data deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete parking data');
    }
  };

  const handleDetailClick = (parking) => {
    setSelectedParkingDetails(parking);
    setIsDetailModalOpen(true); // Open the modal
  };
  
  // Define the columns for the table
  const columns = [
    { label: 'Is Tenant', key: 'isTenant', render: (row) => (row.isTenant ? 'Yes' : 'No') },
    {
      label: 'Name',
      key: 'name',
      render: (row) => {
        if (row.isTenant) {
          const tenantName =
            row.Tenant?.fullName ||
            (row.tenantId && tenantList.find((tenant) => tenant.id === row.tenantId)?.fullName) ||
            'N/A';
          return tenantName;
        } else {
          return row.driverName || 'N/A';
        }
      },
    },
    
    { label: 'Car Plate', key: 'carPlate' },
    { label: 'Car Name', key: 'carName' },
    { label: 'price', key: 'price' },
    { label: 'Status', key: 'status' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex space-x-2">
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

  const handleAddClick = () => {
    window.location.href = '/app/parking-add';
  };

  const tableKey = parkingData.map(p => `${p.id}-${p.updatedAt}`).join('-');

  return (
    <div>
      {pageLoading ? (
        <LoadingComponent />
      ) : (
        <TableComponent
        key={tableKey}
        title="Parking Data"
        data={parkingData}
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
            <h2 className="text-2xl font-bold mb-4">Edit Parking Data</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
  
              {isTenant && (
              <div className="mb-4">
                <label htmlFor="tenantId" className="block text-sm font-medium text-white-700">
                  Select Tenant
                </label>
                <select
                  id="tenantId"
                  value={tenantId}
                  onChange={handleTenantChange}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a tenant</option>
                  {tenantList.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.fullName}
                    </option>
                  ))}
                </select>
              </div>
            )}

              <div className="mb-4">
                <label htmlFor="carPlate" className="block text-sm font-medium text-white-700">Car Plate</label>
                <input
                  type="text"
                  id="carPlate"
                  value={carPlate}
                  onChange={(e) => setCarPlate(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="carName" className="block text-sm font-medium text-white-700">Car Name</label>
                <input
                  type="text"
                  id="carName"
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="driverName" className="block text-sm font-medium text-white-700">Driver Name</label>
                <input
                  type="text"
                  id="driverName"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="driverPhone" className="block text-sm font-medium text-white-700">Driver Phone</label>
                <input
                  type="number"
                  id="driverPhone"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="timeIn" className="block text-sm font-medium text-white-700">Time In</label>
                <input
                  type="text"
                  id="timeIn"
                  value={formatDate(timeIn)} // Display human-readable format
                  disabled // Prevent editing
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="hidden"
                  value={timeIn} // Preserve original ISO format for submission
                />
              </div>
              <div className="mb-4">
                <label htmlFor="timeOut" className="block text-sm font-medium text-white-700">Time Out</label>
                <input
                  type="datetime-local"
                  id="timeOut"
                  value={formatForDateTimeLocal(timeOut)} // Convert to datetime-local format
                  onChange={(e) => setTimeOut(new Date(e.target.value).toISOString())} // Convert back to ISO format
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
                  <option value="completed">completed</option>
                  <option value="onParking">onparking</option>
                  <option value="ready to out">ready to out</option>
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
            <h2 className="text-xl mb-4">Are you sure you want to delete this parking data?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

  {isDetailModalOpen && selectedParkingDetails && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
      <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Parking Details</h2>
        <div className="mb-4">
        <p><strong>Car Plate:</strong> {selectedParkingDetails.carPlate}</p>
        <p><strong>Car Name:</strong> {selectedParkingDetails.carName}</p>
        <p><strong>Driver Name:</strong> {selectedParkingDetails.driverName}</p>
        <p><strong>Driver Phone:</strong> {selectedParkingDetails.driverPhone}</p>
        <p><strong>Time In:</strong> {formatDate(selectedParkingDetails.timeIn)}</p>
        <p><strong>Time Out:</strong> {formatDate(selectedParkingDetails.timeOut)}</p>
        <p><strong>Price:</strong> {selectedParkingDetails.price}</p>
        <p><strong>Status:</strong> {selectedParkingDetails.status}</p>
        <p><strong>Is Tenant:</strong> {selectedParkingDetails.isTenant ? 'Yes' : 'No'}</p>
        {selectedParkingDetails.isTenant && (
          <p><strong>Tenant Name:</strong> {tenantList.find(tenant => tenant.id === selectedParkingDetails.tenantId)?.fullName || 'N/A'}</p>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setIsDetailModalOpen(false)}  // Close the modal
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

export default ParkingPage;