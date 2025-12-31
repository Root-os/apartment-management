import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';
import SmartDateInput from '../../components/Common/smartDatePicker';
import api from '../../utils/api'

const SendLetter = () => {
  // State variables for form inputs
  const [letterTypeId, setLetterTypeId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [letterDate, setLetterDate] = useState('');
  const [description, setDescription] = useState('');
  const [letterTypes, setLetterTypes] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

    const [profiles, setProfiles] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState("");

  useEffect(() => {
    // Fetch letter types
    axios
      .get(`${process.env.REACT_APP_BASE_URL}letter-type`)
      .then((response) => {
        setLetterTypes(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the letter types:', error);
      });

    // Fetch tenants
  const fetchTenants = async () => {
    try {
      const res = await api.get('/tenant/floor-units'); // fetch tenants with units
      setProfiles(res.data); // store full profiles
    } catch (err) {
      console.error('Failed to load tenants', err);
    }
  };
  fetchTenants();
  }, []);

  useEffect(() => {

  const fetchTenants = async () => {
    try {
      const res = await api.get('/tenant/floor-units');

      const mappedTenants = res.data
        .filter(p => p.tenant && p.tenant.length > 0) // only tenants that exist
        .map(p => ({
          id: p.tenant[0].tenantId,   // use tenantId like email page
          fullName: p.fullName,
          phoneNumber: p.phoneNumber,
        }));

      setTenants(mappedTenants);
    } catch (err) {
      console.error('Failed to load tenants', err);
    }
  };

  fetchTenants();
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Reset messages before submitting
    setMessage('');
    setError('');
  
    // Check if all fields are filled
    if (!letterTypeId || !tenantId || !letterDate || !description) {
      setError('All fields are required');
      return;
    }
  
    // Set loading state to true when sending the request
    setLoading(true);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}letter`, {
        letterTypeId,
        tenantId,
        letterDate,
        description,
      });
  
      setLetterTypeId('');
      setTenantId('');
      setLetterDate('');
      setDescription('');
  
      setModalOpen(true);
      setMessageType('success');
      setMessage('Letter sent successfully.');
    } catch (error) {
      if (error.response) {
        setModalOpen(true);
        setMessageType('error');
        setMessage(error.response.data?.message || 'Unable to send letter due to invalid data.');
      } else {
        // Handle network errors or unexpected issues
        setModalOpen(true);
        setMessageType('error');
        setMessage('A network error occurred. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Send Letter" topMargin={'mt-1'}>
        {/* Form to input letter data */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="letterTypeId" className="block text-sm font-medium text-white-700">
              Letter Type
            </label>
            <select
              id="letterTypeId"
              value={letterTypeId}
              onChange={(e) => setLetterTypeId(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="" disabled>
                Select Letter Type
              </option>
              {letterTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

{/* Tenant Dropdown */}
<div className="mb-4">
  <label className="block text-sm font-medium text-white-700">Tenant</label>
  <select
    value={selectedProfileIndex}
    onChange={(e) => {
      const index = e.target.value;
      setSelectedProfileIndex(index);
      setTenantId(""); // reset unit when tenant changes
    }}
    className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
  >
    <option value="">Select Tenant</option>
    {profiles.map((profile, index) => (
      <option key={profile.phoneNumber} value={index}>
        {profile.fullName} ({profile.phoneNumber})
      </option>
    ))}
  </select>
</div>

{/* Unit Dropdown */}
{selectedProfileIndex !== "" &&
  profiles[selectedProfileIndex] &&
  Array.isArray(profiles[selectedProfileIndex].tenant) && (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white-700">Unit</label>
      <select
        value={tenantId}
        onChange={(e) => setTenantId(e.target.value)}
        className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
      >
        <option value="">Select Unit</option>
        {profiles[selectedProfileIndex].tenant.map((t) => (
          <option key={t.tenantId} value={t.tenantId}>
Unit {t.unit?.unitNumber} – Floor {t.floor?.floorNumber}

          </option>
        ))}
      </select>
    </div>
)}


          <div className="mb-4">
            <label htmlFor="letterDate" className="block text-sm font-medium text-white-700">
              Date
            </label>
            <SmartDateInput
              id="letterDate"
              value={letterDate}
              onChange={(date) => setLetterDate(date)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-white-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
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

export default SendLetter;