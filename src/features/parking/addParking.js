import React, { useState, useEffect, useContext } from "react";
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';
import SmartDateInput from '../../components/Common/smartDatePicker';
import { CalendarContext } from '../../context/calendarContext';
import api from '../../utils/api';

const AddParking = () => {
  const [carPlate, setCarPlate] = useState("");
  const [carName, setCarName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [isTenant, setIsTenant] = useState(true); 
  const [parkingSpaceId, setParkingSpaceId] = useState(""); 
  const [status, setStatus] = useState("onparking"); 
  const [tenants, setTenants] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [hasVehicles, setHasVehicles] = useState(false);
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [inlineMessage, setInlineMessage] = useState('');

  const { formatDateForDisplay } = useContext(CalendarContext);

  // Fetch tenants from /api/tenant/floor-units and transform inline
  useEffect(() => {
    api.get(`tenant/floor-units`)
      .then(res => {
        const formattedTenants = res.data.map(item => {
          const allVehicles = item.tenant.flatMap(t => 
            t.vehicles.map(v => ({ ...v, tenantId: t.tenantId }))
          );
          const tenantIds = item.tenant.map(t => t.tenantId);
          const units = item.tenant.map(t => t.unit.unitNumber);

          return {
            fullName: item.fullName,
            phoneNumber: item.phoneNumber,
            tenantIds,
            vehicles: allVehicles,
            units
          };
        });

        setTenants(formattedTenants);
      })
      .catch(err => console.error(err));
  }, []);

  // Handle tenant selection
  const handleTenantChange = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex === "") {
      setTenantId('');
      setVehicles([]);
      setCarPlate('');
      setCarName('');
      setHasVehicles(false);
      setInlineMessage('');
      return;
    }

    const tenant = tenants[selectedIndex];

    // Use first tenantId for backend
    setTenantId(tenant.tenantIds[0]);

    // Set all vehicles for this tenant
    setVehicles(tenant.vehicles);
    setSelectedVehicleIndex('');

    if (tenant.vehicles.length > 0) {
      setHasVehicles(true);
      // setCarPlate(tenant.vehicles[0].carPlate);
      // setCarName(tenant.vehicles[0].carName);
      setInlineMessage('');
    } else {
      setHasVehicles(false);
      setCarPlate('');
      setCarName('');
      setInlineMessage('This tenant has no vehicles. Please enter car details manually.');
    }
  };

  useEffect(() => {
    if (!hasVehicles || selectedVehicleIndex === '') return;

    const index = Number(selectedVehicleIndex); // convert to number

    if (!vehicles[index]) return; // safety check

    const vehicle = vehicles[index];
    setCarPlate(vehicle.carPlate);
    setCarName(vehicle.carName);
    setTenantId(vehicle.tenantId);
  }, [selectedVehicleIndex, vehicles, hasVehicles]);


  const handleCarPlateChange = (value) => {
    setCarPlate(value);
    if (inlineMessage) setInlineMessage('');
  };
  const handleCarNameChange = (value) => {
    setCarName(value);
    if (inlineMessage) setInlineMessage('');
  };

  const getCurrentDateTime = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

useEffect(() => {
  setTimeIn(getCurrentDateTime());
}, []);


  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      carPlate,
      carName,
      driverName,
      driverPhone,
      isTenant,
      timeIn: timeIn ? new Date(timeIn).toISOString() : "",
      status,
    };

    if (isTenant) payload.tenantId = tenantId;
    if (parkingSpaceId) payload.parkingSpaceId = parkingSpaceId;

    api.post('parking', payload)
      .then(res => {
        setModalOpen(true);
        setMessageType('success');
        setMessage('Parking data added successfully.');
        // Reset form
        setCarPlate('');
        setCarName('');
        setDriverName('');
        setDriverPhone('');
        setTenantId('');
        setTimeIn(getCurrentDateTime());
        setVehicles([]);
        setInlineMessage('');
      })
      .catch(err => {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message ||    
         'Unknown error';

        setModalOpen(true);
        setMessageType('error');
        setMessage(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <TitleCard title="Add Parking Data" topMargin="mt-1">
        <form onSubmit={handleSubmit} className="bg-base-100 p-6 rounded-lg shadow-md">

          {/* Tenant Checkbox */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isTenant}
                onChange={(e) => {
                  setIsTenant(e.target.checked);
                  if (!e.target.checked) {
                    setTenantId('');
                    setVehicles([]);
                    setCarPlate('');
                    setCarName('');
                    setInlineMessage('');
                  }
                }}
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
                value={tenants.findIndex(t => t.tenantIds.includes(tenantId))}
                onChange={handleTenantChange}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Tenant</option>
                {tenants.map((tenant, idx) => (
                  <option key={tenant.phoneNumber} value={idx}>
                    {tenant.fullName} — {tenant.phoneNumber}
                  </option>
                ))}
              </select>

              {inlineMessage && (
                <p className="text-sm text-red-500 mt-2">{inlineMessage}</p>
              )}
            </div>
          )}

          {/* Vehicle dropdown */}
          {hasVehicles && vehicles.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Vehicle</label>
              <select
                value={selectedVehicleIndex}
                onChange={(e) => setSelectedVehicleIndex(e.target.value)}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((v, idx) => (
                  <option key={idx} value={idx}>
                    {v.carPlate} — {v.carName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Car Plate */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Car Plate</label>
            <input
              type="text"
              value={carPlate}
              onChange={(e) => handleCarPlateChange(e.target.value)}
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
              onChange={(e) => handleCarNameChange(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Driver fields if not tenant */}
          {!isTenant && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Driver Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Driver Phone</label>
                <input
                  type="number"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </>
          )}

          {/* Time In */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Time In Date</label>
            <SmartDateInput
              value={timeIn.split('T')[0]}
              onChange={(gcDate) => {
                const timePart = timeIn.split('T')[1] || '00:00';
                setTimeIn(`${gcDate}T${timePart}`);
              }}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Time In (Hour & Minute)</label>
            <input
              type="time"
              value={timeIn.split('T')[1] || ''}
              onChange={(e) => {
                const datePart = timeIn.split('T')[0] || getCurrentDateTime().split('T')[0];
                setTimeIn(`${datePart}T${e.target.value}`);
              }}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
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
              onChange={(e) => setStatus(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
            >
              <option value="onparking">On Parking</option>
              <option value="completed">Completed</option>
              <option value="ready to out">Ready to out</option>
            </select>
          </div>


          {/* Submit */}
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
