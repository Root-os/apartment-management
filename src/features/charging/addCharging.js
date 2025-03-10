import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal'

const AddChargingData = () => {
  const [carPlate, setCarPlate] = useState('');
  const [carName, setCarName] = useState('');
  const [isTenant, setIsTenant] = useState(true);
  const [tenantId, setTenantId] = useState('');
  const [chargingStartTime, setChargingStartTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const payload = {
      carPlate,
      carName,
      isTenant,
      tenantId: Number(tenantId), 
      chargingStartTime,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}charging`, payload);
      setCarPlate('');
      setCarName('');
      setTenantId('');
      setChargingStartTime('');

      setModalOpen(true);
      setMessageType('success');
      setMessage(`Charging data added successfully!`);
      window.location.href='/app/charging-view';
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
       <TitleCard   title={'Add Charging Data'} topMargin={'mt-2'} >
      <form onSubmit={handleSubmit} className="space-y-4">
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
                {tenant.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="chargingStartTime" className="font-medium">Charging Start Time</label>
          <input
            type="datetime-local"
            id="chargingStartTime"
            value={chargingStartTime}
            onChange={(e) => setChargingStartTime(e.target.value)}
            className="bg-base-100 px-4 py-2 border rounded-md"
            required
          />
        </div>

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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Add Charging Data'}
        </button>
      </form>
    </TitleCard>
    <Modal
    isOpen={modalOpen}
    onClose={()=>setModalOpen(false)}
    messageType={messageType}
    message={message}  
    />
    </div>
  );
};

export default AddChargingData;