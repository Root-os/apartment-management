import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../../components/Cards/TitleCard'
import Modal from '../../../components/Modal';

const WithdrawalRequestForm = () => {
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState('');
  const [terminationDate, setTerminationDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  // const [message, setMessage] = useState('');

  // Fetch tenant data
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant`);
        setTenants(response.data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }
    };

    fetchTenants();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      tenantId: parseInt(tenantId),
      terminationDate,
      reason,
    };

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token'); 
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}withdrawal-request/submit`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // setMessage(response.data.message);
      setReason('');
      setTerminationDate('');

      setModalOpen(true);
      setMessageType('success');  
      setMessage(response.data.message);
      window.location.href='/app/withdraw-request-view';
    } catch (error) {
      console.error('Error submitting request:', error);
      // setMessage('An error occurred. Please try again.');
      setModalOpen(true);
      setMessageType('error');
      setMessage('Failed to submit withdraw request');

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Send Withdrawal Request" topMargin={'mt-2'}>
      <form onSubmit={handleSubmit}>
        {/* Termination Date */}
        <div className="mb-4">
          <label htmlFor="terminationDate" className="block text-sm font-semibold mb-2">Termination Date</label>
          <input
            type="date"
            id="terminationDate"
            name="terminationDate"
            value={terminationDate}
            onChange={(e) => setTerminationDate(e.target.value)}
            className="bg-base-100 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Reason */}
        <div className="mb-4">
          <label htmlFor="reason" className="block text-sm font-semibold mb-2">Reason</label>
          <textarea
            id="reason"
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="bg-base-100 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-full px-6 py-2 text-white font-semibold rounded-lg focus:outline-none ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
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

export default WithdrawalRequestForm;