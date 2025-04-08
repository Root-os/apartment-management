import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddTenant = () => {
  // State variables for form fields (unchanged)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasCar, setHasCar] = useState(false);
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
  const [freeUnits, setFreeUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch floor data for dropdown (unchanged)
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

  // Fetch freeUnits when floor is selected (unchanged)
  const fetchFreeUnits = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}floor/${id}`);
      setFreeUnits(Array.isArray(response.data.freeUnits) ? response.data.freeUnits : []);
    } catch (err) {
      setError('Failed to fetch freeUnits.');
    }
  };

  // Updated Form Validation
  const validateForm = () => {
    // Validate Full Name (allow letters and spaces)
    const nameRegex = /^[A-Za-z\s]{2,30}$/;
    if (!nameRegex.test(fullName)) {
      setValidationError('Full Name must be 2-30 characters and contain only letters and spaces.');
      return false;
    }
  
    // Validate Phone Number
    const phoneRegex = /^(09|07)\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setValidationError('Phone Number must be 10 digits and start with 09 or 07.');
      return false;
    }
  
    // Validate TIN (optional)
    const tinRegex = /^\d{10}$/;
    if (tin && !tinRegex.test(tin)) {
      setValidationError('TIN must be exactly 10 digits.');
      return false;
    }
  
    // Validate National ID
    const nationalIdRegex = /^[A-Za-z0-9]+$/;
    if (!nationalIdRegex.test(nationalId)) {
      setValidationError('National ID must contain only letters and numbers.');
      return false;
    }
  
    // Check only truly required fields
    if (!fullName || !phoneNumber || !nationalId || !floorId || !unitId || !leaseStartDate || !advance || !paymentStatus) {
      setValidationError('Please fill in all required fields.');
      return false;
    }
  
    // No validation errors for additionalNotes (removed validation)
    // No validation errors for leaseEndDate (removed validation)
    setValidationError('');
    return true;
  };

  // Handle form submission (unchanged)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!validateForm()) {
      setLoading(false);
      return;
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
    formData.append('paymentStatus', paymentStatus);
    formData.append('advance', advance);
  
    // Append additionalNotes only if it is not empty
    if (additionalNotes) {
      formData.append('additionalNotes', additionalNotes);
    }
  
    // Append leaseEndDate only if it is not empty
    if (leaseEndDate) {
      formData.append('leaseEndDate', leaseEndDate);
    }
  
    // Handle car-related data
    if (hasCar) {
      formData.append('carName', carName);
      formData.append('carPlate', carPlate);
      formData.append('color', color);
    }
  
    // Handle document upload
    if (document) {
      formData.append('document', document);
    }
  
    setError('');
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}tenant`, formData);
      console.log('API Response:', response.data);
  
      // Reset form fields
      setFullName('');
      setEmail('');
      setDocument(null);
      setPhoneNumber('');
      setHasCar(false);
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
      const errorMessage = err.response?.data?.error || 'Unknown error occurred';
      console.error('Error Response:', err.response?.data);
  
      setError(errorMessage);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Failed to add tenant: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <TitleCard title={'Add Tenant'} topMargin={'mt-2'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={`bg-base-100 w-full p-3 border rounded-md ${
                validationError && !fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Phone Number <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className={`bg-base-100 w-full p-3 border rounded-md ${
                validationError && !phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">National ID <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              required
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">TIN</label>
            <input
              type="number"
              min="0"
              value={tin}
              onChange={(e) => setTin(e.target.value)}
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Floor <span className="text-red-500">*</span></label>
            <select
              value={floorId}
              onChange={(e) => {
                const selectedFloorId = e.target.value;
                setFloorId(selectedFloorId);
                fetchFreeUnits(selectedFloorId);
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

          <div>
            <label className="block text-sm font-semibold mb-2">Unit <span className="text-red-500">*</span></label>
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

          <div>
            <label className="block text-sm font-semibold mb-2">Lease Start Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={leaseStartDate}
              onChange={(e) => setLeaseStartDate(e.target.value)}
              required
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div>
          <label className="block text-sm font-semibold mb-2">Lease End Date</label>
          <input
            type="date"
            value={leaseEndDate}
            onChange={(e) => setLeaseEndDate(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Payment Status <span className="text-red-500">*</span></label>
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

          <div>
          <label className="block text-sm font-semibold mb-2">Additional Notes</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Advanced Payment <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={advance}
              onChange={(e) => setAdvance(e.target.value)}
              required
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={hasCar}
              onChange={(e) => setHasCar(e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm font-semibold">Tenant has a car</label>
          </div>

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

          <div>
            <label className="block text-sm font-semibold mb-2">Document</label>
            <input
              type="file"
              onChange={(e) => setDocument(e.target.files[0])}
              className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

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