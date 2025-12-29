import React, { useState, useEffect , useContext} from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';
import SmartDateInput from '../../components/Common/smartDatePicker';
import { CalendarContext } from '../../context/calendarContext';

const AddChargingData = () => {
  const [carPlate, setCarPlate] = useState('');
  const [carName, setCarName] = useState('');
  const [isTenant, setIsTenant] = useState(true);
  const [tenantId, setTenantId] = useState('');
  const [chargingStartTime, setChargingStartTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [driverName, setDriverName] = useState('');
  const [tenantCar, setTenantCar] = useState(null); 
  const [messageType, setMessageType] = useState('success');
  const [modalOpen, setModalOpen] = useState(false);

    const { isGregorian } = useContext(CalendarContext);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant`);
        setTenants(response.data);
      } catch (error) {
        console.error('There was an error fetching the tenants:', error);
      }
    };

    fetchTenants();
  }, []);

  // Handle when a tenant is selected
  useEffect(() => {
    if (tenantId) {
      const selectedTenant = tenants.find(tenant => tenant.id === Number(tenantId));
      if (selectedTenant) {
        // Check if the tenant has a car
        if (selectedTenant.TenantVehicles && selectedTenant.TenantVehicles.length > 0) {
          const car = selectedTenant.TenantVehicles[0]; // Assuming only one car is registered per tenant
          setCarPlate(car.carPlate);
          setCarName(car.carName);
          setTenantCar(car); // Store car details
          setMessage(''); // Clear any previous "no car" message
        } else {
          setCarPlate('');
          setCarName('');
          setTenantCar(null); // Clear car details
          setMessage('This tenant has no registered car'); // Display the message
        }
      }
    } else {
      setCarPlate('');
      setCarName('');
      setTenantCar(null); // Clear car details
      setMessage(''); // Clear message if no tenant is selected
    }
  }, [tenantId, tenants]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Convert chargingStartTime to ISO format if it's not already in that format
    const chargingStartDate = new Date(chargingStartTime);
    const chargingStartTimeInUTC = chargingStartDate.toISOString(); // Convert to ISO 8601 string

    const payload = {
      carPlate,
      carName,
      isTenant,
      tenantId: Number(tenantId),
      driverName: isTenant ? '' : driverName, 
      chargingStartTime: chargingStartTimeInUTC, 
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}charging`, payload);
      setCarPlate('');
      setCarName('');
      setTenantId('');
      setChargingStartTime('');
      setDriverName('');

      setModalOpen(true);
      setMessageType('success');
      setMessage(`Charging data added successfully!`);
      window.location.href = '/app/charging-view'; // Navigate to view page
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Failed to add charging data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TitleCard title={'Add Charging Data'} topMargin={'mt-2'}>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="flex items-center space-x-4">
              <label htmlFor="isTenant" className="font-medium">Is Tenant?</label>
              <input
                type="checkbox"
                id="isTenant"
                checked={isTenant}
                onChange={(e) => setIsTenant(e.target.checked)}
                className="h-5 w-5"
              />
            </div>
            {isTenant && ( 
            <div className="flex flex-col">
            <label htmlFor="tenantId" className="font-medium">Tenant </label>
            <select
              id="tenantId"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="bg-base-100 px-4 py-2 border rounded-md"
              disabled={!isTenant}
              required={isTenant}
            >
              <option value="">Select Tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.fullName} — Unit {tenant.Unit?.unitNumber ?? "N/A"}
                </option>
              ))}
            </select>
          </div>
            )}
            {!isTenant && (
            <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Driver Name</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="bg-base-100 w-full p-2 border border-gray-300 rounded"
            />
          </div>)}
          <div className="flex flex-col">
            <label htmlFor="carPlate" className="font-medium">Car Plate</label>
            <input
              type="text"
              id="carPlate"
              value={carPlate}
              onChange={(e) => setCarPlate(e.target.value)}
              className="bg-base-100 px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="carName" className="font-medium">Car Name</label>
            <input
              type="text"
              id="carName"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              className="bg-base-100 px-4 py-2 border rounded-md"
              required
            />
          </div>

<div className="flex flex-col">
  <label htmlFor="chargingStartDate" className="font-medium">Charging Start Date</label>
  <SmartDateInput
    id="chargingStartDate"
    value={chargingStartTime.split('T')[0]} // Extract date part
    onChange={(gcDate) => {
      // Combine new date with existing time
      const timePart = chargingStartTime.split('T')[1] || '00:00';
      setChargingStartTime(`${gcDate}T${timePart}`);
    }}
    className="bg-base-100 px-4 py-2 border rounded-md"
    required
  />
</div>

<div className="flex flex-col">
  <label htmlFor="chargingStartTimeInput" className="font-medium">Charging Start Time (Hour & Minute)</label>
  <input
    type="time"
    id="chargingStartTimeInput"
    value={chargingStartTime.split('T')[1] || ''}
    onChange={(e) => {
      // Combine existing date with new time
      const datePart = chargingStartTime.split('T')[0] || new Date().toISOString().split('T')[0];
      setChargingStartTime(`${datePart}T${e.target.value}`);
    }}
    className="bg-base-100 px-4 py-2 border rounded-md"
    required
  />
</div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Add Charging Data'}
          </button>
        </form>

        {/* Conditionally render the "no registered car" message */}
        {message && (
          <div className="mt-4 text-red-500">{message}</div>
        )}
      </TitleCard>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default AddChargingData;
