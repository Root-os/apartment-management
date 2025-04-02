import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddTenant = () => {
  // State variables for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasCar, setHasCar] = useState(false); // New state for checkbox
  const [carName, setCarName] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [tin, setTin] = useState('');
  const [floorId, setFloorId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [leaseStartDate, setLeaseStartDate] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [validationError, setValidationError] = useState('');
  const [advance, setAdvance] = useState('');
  const [color, setColor] = useState('');
  const [floors, setFloors] = useState([]);
  const [freeUnits, setfreeUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch floor data for dropdown
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}floor`);
        setFloors(response.data);
      } catch (err) {
        setError('Failed to fetch floor data.');
      }
    };
    fetchFloors();
  }, []);

  // Fetch freeUnits when floor is selected
  const fetchfreeUnits = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}floor/${id}`);
      setfreeUnits(Array.isArray(response.data.freeUnits) ? response.data.freeUnits : []);
    } catch (err) {
      setError('Failed to fetch freeUnits.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (additionalNotes.length < 10) {
      setError('Additional notes must be at least 10 characters.');
      setLoading(false);
      return;
    }
  
    if (hasCar) {
      if (!carName || !carPlate || !color) {
        setError('Car Name, Car Plate, and Color are required when tenant has a car.');
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('nationalId', nationalId);
    formData.append('tin', tin);
    formData.append('floorId', floorId);
    formData.append('unitId', unitId);
    formData.append('leaseStartDate', leaseStartDate);
    formData.append('leaseEndDate', leaseEndDate);
    formData.append('paymentStatus', paymentStatus);
    formData.append('additionalNotes', additionalNotes);
    formData.append('advance', advance);

    // Only append car-related details if hasCar is true
    if (hasCar) {
      formData.append('carName', carName);
      formData.append('carPlate', carPlate);
      formData.append('color', color);
    }

    // Append the document if available
    if (document) {
      formData.append('document', document);
    }

    // Log FormData to debug
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}tenant`,
        formData
      );
      console.log('API Response:', response.data);

      // Reset form fields after successful submission
      setFullName('');
      setEmail('');
      setDocument(null);
      setPhoneNumber('');
      setHasCar(false); // Reset the checkbox as well
      setCarName('');
      setCarPlate('');
      setColor('');
      setNationalId('');
      setTin('');
      setFloorId('');
      setUnitId('');
      setLeaseStartDate('');
      setLeaseEndDate('');
      setPaymentStatus('paid');
      setAdditionalNotes('');
      setAdvance('');

      setModalOpen(true);
      setMessageType('success');
      setMessage('Tenant added successfully.');
      window.location.href = '/app/tenant-view';
    } catch (err) {
      console.error('Error Response:', err.response?.data);
      setError('Failed to add tenant: ' + (err.response?.data?.message || 'Unknown error'));
      setModalOpen(true);
      setMessageType('error');
      setMessage('Failed to add tenant: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
};



  return (
    <>
      <TitleCard title={'Add Tenant'} topMargin={'mt-2'} >
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

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              onChange={(e) => {
                const selectedFloorId = e.target.value;
                setFloorId(selectedFloorId);
                fetchfreeUnits(selectedFloorId);
              }}
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a Floor</option>
              {floors.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.floorNumber}
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
              {freeUnits.map((unit) => (
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
              <option value="due">Due</option>
              <option value="overDue">OverDue</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2">Additional Notes</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => {
                const value = e.target.value;
                setAdditionalNotes(value);
                if (value.length < 10) {
                  setValidationError('Additional notes must be at least 10 characters.');
                } else {
                  setValidationError('');
                }
              }}
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
            {validationError && (
              <p className="text-red-500 text-sm mt-2">{validationError}</p>
            )}
          </div>

          {/* Advanced */}
          <div>
            <label className="block text-sm font-semibold mb-2">Advanced Payment</label>
            <input
              type="number"
              value={advance}
              onChange={(e) => setAdvance(e.target.value)}
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
           {/* Has Car Checkbox */}
           <div className="flex items-center">
            <input
              type="checkbox"
              checked={hasCar}
              onChange={(e) => setHasCar(e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm font-semibold">Tenant has a car</label>
          </div>

          {/* Car-related fields - shown only if hasCar is true */}
          {hasCar && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">Car Name</label>
                <input
                  type="text"
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Car Plate</label>
              <input
                  type="text"
                  value={carPlate}
                  onChange={(e) => setCarPlate(e.target.value)}
                  className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Car Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}

          {/* Document */}
          <div>
            <label className="block text-sm font-semibold mb-2">Document</label>
            <input
              type="file"
              onChange={(e) => setDocument(e.target.files[0])}
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
        onClose={() => setModalOpen(false)}
        message={message}
        messageType={messageType}
      />
    </>
  );
};

export default AddTenant;