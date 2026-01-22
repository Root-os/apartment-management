import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard'
import Modal from '../../components/Modal';
import api from '../../utils/api'

const SendNotificationPage = () => {
  const [referenceType, setReferenceType] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [msg, setMsg] = useState('');
  const [tenants, setTenants] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  

  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!token) return;
    // Fetch users (employees)
    axios.get(`${baseUrl}auth/employee`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setUsers(res.data.users))
      .catch(err => console.error('Failed to load users', err));
  }, );

  useEffect(() => {
  if (!token) return;

  const fetchTenants = async () => {
    try {
      const res = await api.get('/tenant/floor-units', {
        headers: { Authorization: `Bearer ${token}` },
      });

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
}, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!referenceType || !referenceId || !msg) {
      return setFeedback({ type: 'error', message: 'All fields are required.' });
    }

    setLoading(true);
    setFeedback({});

    try {
      const payload = { referenceType, referenceId, msg };

      await axios.post(`${baseUrl}sms/send-sms`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setModalOpen(true);
      setMessageType('success');  
      setMessage('SMS sent successfully.');

      setReferenceId('');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');  
      setMessage( error.response?.data?.message || 'Failed to send SMS.');
    } finally {
      setLoading(false);
    }
  };

  const getOptions = () => {
    if (referenceType === 'Tenant') {
      return tenants.map(t => (
        <option key={t.id} value={t.id}>
          {t.fullName} – {t.phoneNumber}
        </option>
      ));
    } else if (referenceType === 'User') {
      return users.map(u => (
        <option key={u.id} value={u.id}>
          {u.fname} {u.lname}
        </option>
      ));
    }
    return null;
  };

  return (
    <>
      <TitleCard title="Send SMS" topMargin="mt-1">

      {feedback.message && (
        <div
          className={`mb-4 p-3 rounded ${
            feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Recipient Type */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Send To</label>
          <select
            value={referenceType}
            onChange={(e) => {
              setReferenceType(e.target.value);
              setReferenceId('');
            }}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Recipient Type</option>
            <option value="Tenant">Tenant</option>
            <option value="User">User</option>
          </select>
        </div>

        {/* Recipient */}
        {referenceType && (
          <div className="mb-4">
            <label className="block font-semibold mb-1">Recipient</label>
            <select
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select {referenceType}</option>
              {getOptions()}
            </select>
          </div>
        )}

        {/* Message */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Message</label>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows="4"
            placeholder="Write your message here..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Sending...' : 'Send SMS'}
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

export default SendNotificationPage;
