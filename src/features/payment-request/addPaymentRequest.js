import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard'
import Modal from '../../components/Modal';

const AddPaymentRequest = () => {
  // State variables for form inputs
  const [tenantId, setTenantId] = useState('');
  const [message, setMessage] = useState('');
  const [billPaymentTypeId, setBillPaymentTypeId] = useState('');
  const [level, setLevel] = useState('high');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [repeatedFor, setRepeatedFor] = useState('monthly');
  const [tenants, setTenants] = useState([]);
  const [billTypes, setBillTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageResponse, setMessageResponse] = useState('');
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');

  // Fetch tenants and bill types from APIs
  useEffect(() => {
    axios.get('https://apartment.houseethiopia.com/api/tenant')
      .then(response => {
        setTenants(response.data);
      })
      .catch(error => {
        setError('Failed to fetch tenants. Please try again.');
      });

    axios.get('https://apartment.houseethiopia.com/api/bill-type')
      .then(response => {
        setBillTypes(response.data);
        console.log(response.data);
      })
      .catch(error => {
        setError('Failed to fetch bill types. Please try again.');
      });
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages before submitting
    setMessageResponse('');
    setError('');

    // Check if all fields are filled
    if (!tenantId || !message || !billPaymentTypeId || !dueDate || !amount || !repeatedFor) {
      setError('All fields are required.');
      return;
    }

    // Set loading state to true while sending the request
    setLoading(true);

    try {
      const response = await axios.post('https://apartment.houseethiopia.com/api/payment-requests', {
        tenantId,
        message,
        billPaymentTypeId,
        level,
        amount,
        dueDate,
        repeatedFor
      });
      setTenantId('');
      setMessage('');
      setBillPaymentTypeId('');
      setLevel('');
      setAmount('');
      setDueDate('');
      setRepeatedFor('monthly');

      setModalOpen(true);
      setMessageType('success');
      setMessage('Payment request added successfully.');
    } catch (error) {
        setModalOpen(true);
        setMessageType('error');
        setMessage('Failed to add payment request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title={'Add Request'} >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="tenantId" className="block text-sm font-medium text-white-700">Tenant</label>
          <select
            id="tenantId"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          >
            <option value="">Select Tenant</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-white-700">Message</label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            placeholder="Enter message"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="billPaymentTypeId" className="block text-sm font-medium text-white-700">Bill Type</label>
          <select
            id="billPaymentTypeId"
            value={billPaymentTypeId}
            onChange={(e) => setBillPaymentTypeId(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          >
            <option value="">Select Bill Payment Type</option>
            {billTypes.map((billType) => (
              <option key={billType.id} value={billType.id}>
                {billType.typeName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="level" className="block text-sm font-medium text-white-700">Level</label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-white-700">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-sm font-medium text-white-700">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="repeatedFor" className="block text-sm font-medium text-white-700">Repeat For</label>
          <select
            id="repeatedFor"
            value={repeatedFor}
            onChange={(e) => setRepeatedFor(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="one-time">One-time</option>
          </select>
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

export default AddPaymentRequest;
