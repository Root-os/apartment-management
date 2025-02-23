import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddTenant = () => {
  // State variables for form fields
  const [fullName, setFullName] = useState('');
  const [document, setDocument] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [carName, setCarName] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [tin, setTin] = useState('');
  const [floorId, setFloorId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [leaseStartDate, setLeaseStartDate] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [advanced, setAdvanced] = useState(0);
  const [password, setPassword] = useState('');
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState(''); 

  // Fetch floor data for dropdown
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/floor');
        setFloors(response.data);
      } catch (err) {
        setError('Failed to fetch floor data.');
      }
    };

    fetchFloors();
  }, []);

  // Fetch units when floor is selected
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/unit');
        setUnits(response.data);
      } catch (err) {
        setError('Failed to fetch units.');
      }
    };

    fetchUnits();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('document', document);
    formData.append('phoneNumber', phoneNumber);
    formData.append('carName', carName);
    formData.append('carPlate', carPlate);
    formData.append('nationalId', nationalId);
    formData.append('tin', tin);
    formData.append('floorId', floorId);
    formData.append('unitId', unitId);
    formData.append('leaseStartDate', leaseStartDate);
    formData.append('leaseEndDate', leaseEndDate);
    formData.append('paymentStatus', paymentStatus);
    formData.append('additionalNotes', additionalNotes);
    formData.append('advanced', advanced);
    formData.append('password', password);

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://apartment.houseethiopia.com/api/tenant',
        formData
      );
      console.log('Tenant added successfully:', response.data);
      // Reset form after submission
      setFullName('');
      setDocument(null);
      setPhoneNumber('');
      setCarName('');
      setCarPlate('');
      setNationalId('');
      setTin('');
      setFloorId('');
      setUnitId('');
      setLeaseStartDate('');
      setLeaseEndDate('');
      setPaymentStatus('');
      setAdditionalNotes('');
      setAdvanced('');
      setPassword('');
      setLoading(false);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Tenant added successfully.');
    } catch (err) {
      setError('Failed to add tenant.');
      setLoading(false);

      setModalOpen(true); 
      setMessageType('error');
      setMessage('Failed to add tenant.');
    }
  };

  return (
    <><TitleCard title={'Add Tenant'}  >

      {error && <div className="bg-red-300 p-3 mb-4 text-red-800">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Document */}
        <div>
          <label className="block text-sm font-semibold mb-2">Document</label>
          <input
            type="file"
            onChange={(e) => setDocument(e.target.files[0])}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-semibold mb-2">Phone Number</label>
          <input
            type="number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Car Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">Car Name</label>
          <input
            type="text"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Car Plate */}
        <div>
          <label className="block text-sm font-semibold mb-2">Car Plate</label>
          <input
            type="text"
            value={carPlate}
            onChange={(e) => setCarPlate(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* National ID */}
        <div>
          <label className="block text-sm font-semibold mb-2">National ID</label>
          <input
            type="text"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            required
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* TIN */}
        <div>
          <label className="block text-sm font-semibold mb-2">TIN</label>
          <input
            type="text"
            value={tin}
            onChange={(e) => setTin(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Floor Dropdown */}
        <div>
          <label className="block text-sm font-semibold mb-2">Floor</label>
          <select
            value={floorId}
            onChange={(e) => setFloorId(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a Floor</option>
            {floors.map((floor) => (
              <option key={floor.id} value={floor.id}>
                {floor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Unit Dropdown */}
        <div>
          <label className="block text-sm font-semibold mb-2">Unit</label>
          <select
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a Unit</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.unitNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Lease Start Date */}
        <div>
          <label className="block text-sm font-semibold mb-2">Lease Start Date</label>
          <input
            type="date"
            value={leaseStartDate}
            onChange={(e) => setLeaseStartDate(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Lease End Date */}
        <div>
          <label className="block text-sm font-semibold mb-2">Lease End Date</label>
          <input
            type="date"
            value={leaseEndDate}
            onChange={(e) => setLeaseEndDate(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Payment Status */}
        <div>
          <label className="block text-sm font-semibold mb-2">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            required
          >
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-semibold mb-2">Additional Notes</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Advanced */}
        <div>
          <label className="block text-sm font-semibold mb-2">Advanced Payment</label>
          <input
            type="number"
            value={advanced}
            onChange={(e) => setAdvanced(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 bg-blue-500 text-white rounded-md ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Submitting...' : 'Add Tenant'}
          </button>
        </div>
      </form>
      </TitleCard>
      <Modal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        message={message}
        messageType={messageType}     
      />
      </>
  );
};

export default AddTenant;