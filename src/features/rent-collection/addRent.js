import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddCollectedRent = () => {
  const [tenantId, setTenantId] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentFrequency, setPaymentFrequency] = useState('by day');
  const [nextDueDate, setNextDueDate] = useState('');
  const [status, setStatus] = useState('paid');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant`);
        setTenants(response.data);
      } catch (err) {
        setError('Failed to fetch tenant data.');
        setIsModalOpen(true);
      }
    };

    fetchTenants();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const payload = {
      tenantId: parseInt(tenantId),
      amountPaid: parseFloat(amountPaid),
      paymentDate,
      paymentMethod,
      paymentFrequency,
      nextDueDate,
      status
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}rent-collection`, payload);
      setLoading(false);
      setMessage(response.data.message); // Display success message
      setIsModalOpen(true);
    } catch (err) {
      setLoading(false);
      setError('Error adding rent collection. Please try again.'); // Display error message
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <TitleCard title="Add Collected Rent">
        {/* Rent Collection Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tenant Dropdown */}
          <div>
            <label htmlFor="tenantId" className="block text-sm font-medium text-white-700">Tenant</label>
            <select
              id="tenantId"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Amount Paid Field */}
          <div>
            <label htmlFor="amountPaid" className="block text-sm font-medium text-white-700">Amount Paid</label>
            <input
              type="number"
              id="amountPaid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Payment Date Field */}
          <div>
            <label htmlFor="paymentDate" className="block text-sm font-medium text-white-700">Payment Date</label>
            <input
              type="date"
              id="paymentDate"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Payment Method Dropdown */}
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-white-700">Payment Method</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>

          {/* Payment Frequency Dropdown */}
          <div>
            <label htmlFor="paymentFrequency" className="block text-sm font-medium text-white-700">Payment Frequency</label>
            <select
              id="paymentFrequency"
              value={paymentFrequency}
              onChange={(e) => setPaymentFrequency(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          {/* Next Due Date Field */}
          <div>
            <label htmlFor="nextDueDate" className="block text-sm font-medium text-white-700">Next Due Date</label>
            <input
              type="date"
              id="nextDueDate"
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-white-700">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="paid">Paid</option>
              <option value="pending">pending</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Rent Payment'}
          </button>
        </form>
      </TitleCard>

      {/* Success and Error Modals */}
      {message && (
        <Modal
          isOpen={true}
          onClose={() => setMessage('')}
          type="success"
          message={message}
        />
      )}
      {error && (
        <Modal
          isOpen={true}
          onClose={() => setError('')}
          type="error"
          message={error}
        />
      )}
    </>
  );
};

export default AddCollectedRent;