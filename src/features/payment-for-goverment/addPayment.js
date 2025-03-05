import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddGovBillPayment = () => {
  // States for form inputs
  const [billTypeId, setBillTypeId] = useState('');
  const [billTypes, setBillTypes] = useState([]);
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [description, setDescription] = useState('');

  // States for loading, success, and error
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageType, setMessageType] = useState(''); // success, warning, or error

  // Fetch Bill Types on Component Mount
  useEffect(() => {
    const fetchBillTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}bill-type`);
        setBillTypes(response.data); 
      } catch (err) {
        setError('Failed to fetch bill types. Please try again.');
        setMessageType('error');
        setIsModalOpen(true);
      }
    };

    fetchBillTypes();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Prepare the payload data
    const payload = {
      billTypeId,
      amount: parseFloat(amount),
      startDate,
      endDate,
      status,
      paymentMethod,
      description
    };

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}bill-payments`, payload);
      setLoading(false);
      setMessage('Bill payment added successfully!');
      setMessageType('success');
      setIsModalOpen(true);
    } catch (err) {
      setLoading(false);
      setError('Error adding bill payment. Please try again.');
      setMessageType('error');
      setIsModalOpen(true);
    }
  };

  // Validate description length
  const validateDescription = (desc) => {
    if (desc.length < 15) {
      setError('Description must be at least 15 characters.');
      setMessageType('error');
    } else {
      setError('');
      setMessageType(''); // Reset messageType if description is valid
    }
    setDescription(desc);
  };

  return (
    <>
      <TitleCard title="Add Bill Payments for Government" topMargin={'mt-4'}>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <label htmlFor="billTypeId" className="block text-sm font-medium text-white-700 dark:text-gray-300">Bill Type</label>
            <select
              id="billTypeId"
              value={billTypeId}
              onChange={(e) => setBillTypeId(e.target.value)}
              className="bg-base-100 dark:bg-gray-900 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Bill Type</option>
              {billTypes.map((billType) => (
                <option key={billType.id} value={billType.id}>
                  {billType.typeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-white-700 dark:text-gray-300">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-base-100 dark:bg-gray-900 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-full">
              <label htmlFor="startDate" className=" dark:text-gray-300 block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="dark:bg-gray-900 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="endDate" className="dark:text-gray-300 block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="dark:bg-gray-900 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="dark:text-gray-300 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => validateDescription(e.target.value)}
              className="dark:bg-gray-900 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-full">
              <label htmlFor="status" className="dark:text-gray-300 block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="dark:bg-gray-900 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="w-full">
              <label htmlFor="paymentMethod" className="dark:text-gray-300 block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="dark:bg-gray-900 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Add Payment'}
          </button>
        </form>
      </TitleCard>

      {/* Modal for displaying success or error message */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          messageType={messageType} // Pass messageType for success/error styling
          message={message || error} // Pass either success or error message
        />
      )}
    </>
  );
};

export default AddGovBillPayment;
