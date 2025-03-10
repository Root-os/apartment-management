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
  const [isTenant, setIsTenant] = useState(true);
  const [parkingSpaceId, setParkingSpaceId] = useState(""); 
  const [tenants, setTenants] = useState([]);
  const [status, setStatus] = useState("onparking"); 

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert the times to UTC format
    const timeInUTC = timeIn ? new Date(timeIn).toISOString() : "";
    // const timeOutUTC = timeOut ? new Date(timeOut).toISOString() : ""; 

    const parkingData = {
      carPlate,
      carName,
      driverName,
      driverPhone,
      tenantId,
      timeIn: timeInUTC, // UTC formatted time
      // timeOut: timeOutUTC, // UTC formatted time 
      isTenant,
      status,
      parkingSpaceId,
    };

    axios
      .post(`${process.env.REACT_APP_BASE_URL}parking`, parkingData)
      .then((response) => {
        setCarPlate("");
        setCarName("");
        setDriverName("");
        setDriverPhone("");
        setTenantId("");
        setTimeIn("");
        setTimeOut("");

        setModalOpen(true);
        setMessageType('success');
        setMessage('Parking data added successfully');
        window.location.href='/app/parking-view';
      })
      .catch(() => {
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

          {/* Driver Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Driver Name</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Driver Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Driver Phone</label>
            <input
              type="text"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Tenant Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tenant</label>
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.fullName}
                </option>
              ))}
            </select>
          </div>

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
              value={parkingSpaceId}
              onChange={(e) => setParkingSpaceId(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              required
            />
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
