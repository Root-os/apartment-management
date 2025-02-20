import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard'

const AddCollectedRent = () => {
  // States for form inputs
  const [tenantId, setTenantId] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentFrequency, setPaymentFrequency] = useState('by day');
  const [nextDueDate, setNextDueDate] = useState('');
  const [status, setStatus] = useState('paid');

  // States for loading, success, and error messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // State for tenant data
  const [tenants, setTenants] = useState([]);

  // Fetch tenant data from the API
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/tenant');
        setTenants(response.data);
      } catch (err) {
        setError('Failed to fetch tenant data.');
      }
    };

    fetchTenants();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Prepare the payload data
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
      // Send POST request to the rent collection API
      const response = await axios.post('https://apartment.houseethiopia.com/api/rent-collection', payload);
      setLoading(false);
      setMessage(response.data.message); // Display success message
    } catch (err) {
      setLoading(false);
      setError('Error adding rent collection. Please try again.'); // Display error message
    }
  };

  return (
   <>
   <TitleCard title="Add Collected Rent">

        {/* Success or Error Message */}
        {message && <div className="text-green-500 text-center mb-4">{message}</div>}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

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
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Mobile Payment">Mobile Payment</option>
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
              <option value="by day">By Day</option>
              <option value="by week">By Week</option>
              <option value="by month">By Month</option>
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
              <option value="pending">Pending</option>
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
        </>
  );
};

export default AddCollectedRent;