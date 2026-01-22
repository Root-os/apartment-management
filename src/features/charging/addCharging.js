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
  const [persons, setPersons] = useState([]);
  const [selectedPersonIndex, setSelectedPersonIndex] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState('');
  const [hasVehicles, setHasVehicles] = useState(false);
  const [inlineMessage, setInlineMessage] = useState('');
  

    const { isGregorian } = useContext(CalendarContext);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}tenant/floor-units`
        );
        setPersons(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTenants();
  }, []);

  useEffect(() => {
    if (selectedPersonIndex === '') {
      setVehicles([]);
      setSelectedVehicleIndex('');
      setCarPlate('');
      setCarName('');
      setHasVehicles(false);
      setTenantId(''); // clear tenantId
      return;
    }

    const person = persons[selectedPersonIndex];

    // Gather all vehicles from all tenantIds
    const allVehicles = person.tenant.flatMap(t =>
      t.vehicles.map(v => ({
        ...v,
        tenantId: t.tenantId
      }))
    );

    setVehicles(allVehicles);
    setSelectedVehicleIndex('');

    if (allVehicles.length > 0) {
      setHasVehicles(true);
      setInlineMessage('');
      // setCarPlate(allVehicles[0].carPlate);
      // setCarName(allVehicles[0].carName);
      // setTenantId(allVehicles[0].tenantId);
    } else {
      // Tenant has no vehicles → manual input
      setHasVehicles(false);
      setCarPlate('');
      setCarName('');
      // IMPORTANT: assign tenantId from the **first tenant record**
      setTenantId(person.tenant[0].tenantId);
      setInlineMessage('This tenant has no registered vehicles. Please enter details manually.');
    }
  }, [selectedPersonIndex, persons]);

  useEffect(() => {
    if (!hasVehicles || selectedVehicleIndex === '') return;

    const vehicle = vehicles[selectedVehicleIndex];
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
    setChargingStartTime(getCurrentDateTime());
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Convert chargingStartTime to ISO format if it's not already in that format
    const chargingStartDate = new Date(chargingStartTime);
    const chargingStartTimeInUTC = chargingStartDate.toISOString(); 

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
      setChargingStartTime(getCurrentDateTime());
      setDriverName('');

      setModalOpen(true);
      setMessageType('success');
      setMessage(`Charging data added successfully!`);
      // window.location.href = '/app/charging-view'; 
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      setModalOpen(true);
      setMessageType('error');
      setMessage(errorMessage);
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
              <label className="font-medium">Tenant</label>
              <select
                value={selectedPersonIndex}
                onChange={(e) => setSelectedPersonIndex(e.target.value)}
                className="bg-base-100 px-4 py-2 border rounded-md"
                required
              >
                <option value="">Select Tenant</option>
                {persons.map((p, index) => (
                  <option key={index} value={index}>
                    {p.fullName} — {p.phoneNumber}
                  </option>
                ))}
              </select>
            </div>
            )}

            {hasVehicles && vehicles.length > 0 && (
              <div className="flex flex-col">
                <label className="font-medium">Vehicle</label>
                <select
                  value={selectedVehicleIndex}
                  onChange={(e) => setSelectedVehicleIndex(e.target.value)}
                  className="bg-base-100 px-4 py-2 border rounded-md"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((v, index) => (
                    <option key={index} value={index}>
                      {v.carPlate} — {v.carName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Inline message */}
            {inlineMessage && (
              <p className="mt-2 text-red-500">{inlineMessage}</p>
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
            onChange={(e) => handleCarPlateChange(e.target.value)}
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
            onChange={(e) => handleCarNameChange(e.target.value)}
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
