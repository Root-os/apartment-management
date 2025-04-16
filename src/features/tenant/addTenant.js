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
  const [hasCar, setHasCar] = useState(false);
  const [carName, setCarName] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [tin, setTin] = useState('');
  const [floorId, setFloorId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [leaseStartDate, setLeaseStartDate] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const [amount, setAmount] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [advance, setAdvance] = useState('');
  const [color, setColor] = useState('');
  const [floors, setFloors] = useState([]);
  const [freeUnits, setFreeUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // State for individual field errors
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    nationalId: '',
    tin: '',
    floorId: '',
    unitId: '',
    leaseStartDate: '',
    leaseEndDate: '',
    amount: '',
    advance: '',
    carName: '',
    carPlate: '',
    color: '',
    document: '',
    api: '',
  });

  // Fetch floor data for dropdown
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}floor`);
        setFloors(response.data);
      } catch (err) {
        setErrors((prev) => ({ ...prev, api: 'Failed to fetch floor data.' }));
      }
    };
    fetchFloors();
  }, []);

  // Fetch freeUnits when floor is selected
  const fetchFreeUnits = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}floor/${id}`);
      setFreeUnits(Array.isArray(response.data.freeUnits) ? response.data.freeUnits : []);
    } catch (err) {
      setErrors((prev) => ({ ...prev, api: 'Failed to fetch free units.' }));
    }
  };

  // Validation functions for each field
  const validateFullName = (value) => {
    const nameRegex = /^[A-Za-z\s]{2,30}$/;
    if (!value) return 'Full Name is required.';
    if (!nameRegex.test(value)) return 'Full Name must be 2-30 characters and contain only letters and spaces.';
    return '';
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) return 'Please enter a valid email address.';
    return '';
  };

  const validatePhoneNumber = (value) => {
    const phoneRegex = /^(09|07)\d{8}$/;
    if (!value) return 'Phone Number is required.';
    if (!phoneRegex.test(value)) return 'Phone Number must be 10 digits and start with 09 or 07.';
    return '';
  };

  const validateNationalId = (value) => {
    const nationalIdRegex = /^[A-Za-z0-9]+$/;
    if (!value) return 'National ID is required.';
    if (!nationalIdRegex.test(value)) return 'National ID must contain only letters and numbers.';
    return '';
  };

  const validateTin = (value) => {
    const tinRegex = /^\d{10}$/;
    if (value && !tinRegex.test(value)) return 'TIN must be exactly 10 digits.';
    return '';
  };

  const validateFloorId = (value) => {
    if (!value) return 'Floor selection is required.';
    return '';
  };

  const validateUnitId = (value) => {
    if (!value) return 'Unit selection is required.';
    return '';
  };

  const validateLeaseStartDate = (value) => {
    if (!value) return 'Lease Start Date is required.';
    return '';
  };

  const validateLeaseEndDate = (value, startDate) => {
    if (value && startDate && new Date(value) <= new Date(startDate)) {
      return 'Lease End Date must be after Lease Start Date.';
    }
    return '';
  };

  const validateAmount = (value) => {
    if (!value) return 'Payment Status is required.';
    return '';
  };

  const validateAdvance = (value) => {
    if (!value) return 'Advance Payment is required.';
    if (value && (isNaN(value) || value < 0)) return 'Advance Payment must be a positive number.';
    return '';
  };

  const validateCarName = (value, hasCar) => {
    if (hasCar && !value) return 'Car Name is required if tenant has a car.';
    return '';
  };

  const validateCarPlate = (value, hasCar) => {
    if (hasCar && !value) return 'Car Plate is required if tenant has a car.';
    return '';
  };

  const validateCarColor = (value, hasCar) => {
    if (hasCar && !value) return 'Car Color is required if tenant has a car.';
    return '';
  };

  const validateDocument = (value) => {
    if (value && value.size > 5 * 1024 * 1024) return 'Document size must be less than 5MB.';
    return '';
  };

  // Validate all fields on form submission
  const validateForm = () => {
    const newErrors = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      phoneNumber: validatePhoneNumber(phoneNumber),
      nationalId: validateNationalId(nationalId),
      tin: validateTin(tin),
      floorId: validateFloorId(floorId),
      unitId: validateUnitId(unitId),
      leaseStartDate: validateLeaseStartDate(leaseStartDate),
      leaseEndDate: validateLeaseEndDate(leaseEndDate, leaseStartDate),
      amount: validateAmount(amount),
      advance: validateAdvance(advance),
      carName: validateCarName(carName, hasCar),
      carPlate: validateCarPlate(carPlate, hasCar),
      color: validateCarColor(color, hasCar),
      document: validateDocument(document),
      api: '',
    };

    setErrors(newErrors);

    // Only prevent submission if required fields have errors
    const requiredFieldsHaveErrors = [
      newErrors.fullName,
      newErrors.phoneNumber,
      newErrors.nationalId,
      newErrors.floorId,
      newErrors.unitId,
      newErrors.leaseStartDate,
      newErrors.amount,
      newErrors.advance,
      ...(hasCar ? [newErrors.carName, newErrors.carPlate, newErrors.color] : []),
    ].some((error) => error !== '');

    return !requiredFieldsHaveErrors;
  };

  // Handle form submission
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
    formData.append('amount', amount);
    formData.append('advance', advance);

    if (additionalNotes) formData.append('additionalNotes', additionalNotes);
    if (leaseEndDate) formData.append('leaseEndDate', leaseEndDate);
    if (hasCar) {
      formData.append('carName', carName);
      formData.append('carPlate', carPlate);
      formData.append('color', color);
    }
    if (document) formData.append('document', document);

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
      setAmount('');
      setAdditionalNotes('');
      setAdvance('');
      setErrors({});

      setModalOpen(true);
      setMessageType('success');
      setMessage('Tenant added successfully.');
      window.location.href = '/app/tenant-view';
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Unknown error occurred';
      console.error('Error Response:', err.response?.data);
      setErrors((prev) => ({ ...prev, api: 'Failed to add tenant: ' + errorMessage }));
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
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors((prev) => ({ ...prev, fullName: validateFullName(e.target.value) }));
              }}
              className={`bg-base-100 w-full p-3 border rounded-md ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
              }}
              className={`bg-base-100 w-full p-3 border rounded-md ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setErrors((prev) => ({ ...prev, phoneNumber: validatePhoneNumber(e.target.value) }));
              }}
              className={`bg-base-100 w-full p-3 border rounded-md ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* National ID */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              National ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => {
                setNationalId(e.target.value);
                setErrors((prev) => ({ ...prev, nationalId: validateNationalId(e.target.value) }));
              }}
              className={`bg-base-100 w-full p-3 border rounded-md ${
                errors.nationalId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
          </div>

          {/* TIN */}
          <div>
            <label className="block text-sm font-semibold mb-2">TIN</label>
            <input
              type="text"
              value={tin}
              onChange={(e) => {
                setTin(e.target.value);
                setErrors((prev) => ({ ...prev, tin: validateTin(e.target.value) }));
              }}
              className={`bg-base-100 w-full p-3 border rounded-md ${
                errors.tin ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.tin && <p className="text-red-500 text-sm mt-1">{errors.tin}</p>}
          </div>

          {/* Floor */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Floor <span className="text-red-500">*</span>
            </label>
            <select
              value={floorId}
              onChange={(e) => {
                const selectedFloorId = e.target.value;
                setFloorId(selectedFloorId);
                setErrors((prev) => ({ ...prev, floorId: validateFloorId(selectedFloorId) }));
                if (selectedFloorId) fetchFreeUnits(selectedFloorId);
              }}
              className={`bg-base-100 w-full p-3 border rounded-md ${
                errors.floorId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a Floor</option>
              {floors.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.floorNumber}
                </option>
              ))}
            </select>
            {errors.floorId && <p className="text-red-500 text-sm mt-1">{errors.floorId}</p>}
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              value={unitId}
              onChange={(e) => {
                setUnitId(e.target.value);
                setErrors((prev) => ({ ...prev, unitId: validateUnitId(e.target.value) }));
              }}
              className={`bg-base-100 w-full p-3 border rounded-md ${
                errors.unitId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a Unit</option>
              {freeUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unitNumber}
                </option>
              ))}
            </select>
            {errors.unitId && <p className="text-red-500 text-sm mt-1">{errors.unitId}</p>}
          </div>

          {/* Lease Start Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Lease Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={leaseStartDate}
              onChange={(e) => {
                setLeaseStartDate(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  leaseStartDate: validateLeaseStartDate(e.target.value),
                  leaseEndDate: validateLeaseEndDate(leaseEndDate, e.target.value),
                }));
              }}
              className={`bg-base-100 w-full p-3 border rounded-md ${
                errors.leaseStartDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.leaseStartDate && <p className="text-red-500 text-sm mt-1">{errors.leaseStartDate}</p>}
          </div>

          {/* Lease End Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">Lease End Date</label>
            <input
              type="date"
              value={leaseEndDate}
              onChange={(e) => {
                setLeaseEndDate(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  leaseEndDate: validateLeaseEndDate(e.target.value, leaseStartDate),
                }));
              }}
              className={`bg-base-100 w-full p-3 border rounded-md ${
                errors.leaseEndDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.leaseEndDate && <p className="text-red-500 text-sm mt-1">{errors.leaseEndDate}</p>}
          </div>

          {/* Amount */}
          <div>
          <label className="block text-sm font-semibold mb-2">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={amount}
              min="o"
              step="1"
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  amount: validateAmount(e.target.value, amount),
                }));
              }}
              className={`bg-base-100 w-full p-3 border rounded-md ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
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

          {/* Advance Payment */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Advance Payment <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={advance}
              onChange={(e) => {
                setAdvance(e.target.value);
                setErrors((prev) => ({ ...prev, advance: validateAdvance(e.target.value) }));
              }}
              className={`bg-base-100 w-full p-3 border rounded-md ${
                errors.advance ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.advance && <p className="text-red-500 text-sm mt-1">{errors.advance}</p>}
          </div>

          {/* Has Car Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={hasCar}
              onChange={(e) => {
                setHasCar(e.target.checked);
                if (!e.target.checked) {
                  setCarName('');
                  setCarPlate('');
                  setColor('');
                  setErrors((prev) => ({ ...prev, carName: '', carPlate: '', color: '' }));
                }
              }}
              className="mr-2"
            />
            <label className="text-sm font-semibold">Tenant has a car</label>
          </div>

          {/* Car Details (Conditional) */}
          {hasCar && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Car Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={carName}
                  onChange={(e) => {
                    setCarName(e.target.value);
                    setErrors((prev) => ({ ...prev, carName: validateCarName(e.target.value, hasCar) }));
                  }}
                  className={`bg-base-100 w-full p-3 border rounded-md ${
                    errors.carName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.carName && <p className="text-red-500 text-sm mt-1">{errors.carName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Car Plate <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={carPlate}
                  onChange={(e) => {
                    setCarPlate(e.target.value);
                    setErrors((prev) => ({ ...prev, carPlate: validateCarPlate(e.target.value, hasCar) }));
                  }}
                  className={`bg-base-100 w-full p-3 border rounded-md ${
                    errors.carPlate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.carPlate && <p className="text-red-500 text-sm mt-1">{errors.carPlate}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Car Color <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    setErrors((prev) => ({ ...prev, color: validateCarColor(e.target.value, hasCar) }));
                  }}
                  className={`bg-base-100 w-full p-3 border rounded-md ${
                    errors.color ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
              </div>
            </>
          )}

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">Document</label>
            <input
              type="file"
              onChange={(e) => {
                setDocument(e.target.files[0]);
                setErrors((prev) => ({ ...prev, document: validateDocument(e.target.files[0]) }));
              }}
              className={`bg-base-100 w-full p-3 border rounded-md ${
                errors.document ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.document && <p className="text-red-500 text-sm mt-1">{errors.document}</p>}
          </div>

          {/* API Error */}
          {errors.api && <p className="text-red-500 text-sm mt-2">{errors.api}</p>}

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