import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddParking = () => {
  const [carPlate, setCarPlate] = useState("");
  const [carName, setCarName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [isTenant, setIsTenant] = useState(true); // Default to tenant
  const [parkingSpaceId, setParkingSpaceId] = useState(""); 
  const [status, setStatus] = useState("onparking"); // Default status "onparking"
  const [tenants, setTenants] = useState([]);
  const [tenantCar, setTenantCar] = useState(null); // For tenant's car details
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}tenant`)
      .then((response) => {
        setTenants(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tenants:", error);
      });
  }, []);

  // Handle checkbox toggle for Is Tenant
  const handleIsTenantChange = (e) => {
    setIsTenant(e.target.checked);
    if (!e.target.checked) {
      // If not tenant, reset tenant data
      setTenantId("");
      setTenantCar(null);
    }
  };

  // Handle tenant selection
  const handleTenantChange = (e) => {
    const selectedTenant = tenants.find(tenant => tenant.id === parseInt(e.target.value));
    setTenantId(selectedTenant.id);
    if (selectedTenant && selectedTenant.TenantVehicles.length > 0) {
      // If tenant has a car, auto-fill car details
      setTenantCar(selectedTenant.TenantVehicles[0]);
      setCarPlate(selectedTenant.TenantVehicles[0].carPlate);
      setCarName(selectedTenant.TenantVehicles[0].carName);
    } else {
      // If no car, clear car details and allow manual input
      setTenantCar(null);
      setCarPlate("");
      setCarName("");
    }
  };

  // Handle the status change
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Convert the times to UTC format
    const timeInUTC = timeIn ? new Date(timeIn).toISOString() : "";
  
    // Prepare parking data payload
    const parkingData = {
      carPlate,
      carName,
      driverName,
      driverPhone,
      timeIn: timeInUTC,
      isTenant,
      status,
    };
  
    // Add tenantId only if isTenant is true
    if (isTenant) {
      parkingData.tenantId = tenantId;
    }
  
    // Add parkingSpaceId only if it's not empty
    if (parkingSpaceId) {
      parkingData.parkingSpaceId = parkingSpaceId;
    }
  
    // Log the data that will be sent to the server
    console.log("Sending parking data to server:", parkingData);
  
    axios
      .post(`${process.env.REACT_APP_BASE_URL}parking`, parkingData)
      .then((response) => {
        // Log the successful response from the server
        console.log("Server response:", response);
        
        setCarPlate("");
        setCarName("");
        setDriverName("");
        setDriverPhone("");
        setTenantId("");
        setTimeIn("");
  
        setModalOpen(true);
        setMessageType('success');
        setMessage('Parking data added successfully');
        window.location.href='/app/parking-view';
      })
      .catch((error) => {
        // Log the error response from the server
        console.error("Error from server:", error.response);
  
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to add parking data.');
      })
      .finally(() => {
        setLoading(false); 
      });
  };
  
  
  
  return (
    <>
      <TitleCard title="Add Parking Data" topMargin={'mt-4'}>
        <form onSubmit={handleSubmit} className="bg-base-100 p-6 rounded-lg shadow-md">
          {/* Tenant Checkbox */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isTenant}
                onChange={handleIsTenantChange}
                className="mr-2"
              />
              <span className="text-sm">Is Tenant?</span>
            </label>
          </div>

          
          {/* Tenant Select */}
          {isTenant && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tenant</label>
              <select
                value={tenantId} 
                onChange={handleTenantChange}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.fullName}
                  </option>
                ))}
              </select>
              {tenantId && tenantCar === null && (
                <p className="text-sm text-red-500 mt-2">Tenant has no car. Please enter car details manually.</p>
              )}
            </div>
          )}

          {/* Car Plate */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Car Plate</label>
            <input
              type="text"
              value={carPlate}
              onChange={(e) => setCarPlate(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Car Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Car Name</label>
            <input
              type="text"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
         {!isTenant && ( <>
          {/* Driver Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Driver Name</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {/* Driver Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Driver Phone</label>
            <input
              type="number"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              
            />
          </div>
         </> )}
          {/* Time In */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Time In</label>
            <input
              type="datetime-local"
              value={timeIn}
              onChange={(e) => setTimeIn(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Parking Space */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Parking Space ID</label>
            <input
              type="number"
              min="1"
              step="1"
              value={parkingSpaceId}
              onChange={(e) => setParkingSpaceId(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={status}
              onChange={handleStatusChange}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
            >
              <option value="onparking">On Parking</option>
              <option value="offparking">Off Parking</option>
              <option value="reserved">Reserved</option>
              <option value="vacant">Vacant</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {loading ? 'Submitting...' : 'Add Parking'}
          </button>
        </form>
      </TitleCard>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </>
  );
};

export default AddParking;
