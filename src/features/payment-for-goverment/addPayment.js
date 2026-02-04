import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';
import SmartDateInput from '../../components/Common/smartDatePicker';

const AddGovBillPayment = () => {
  // States for form inputs
  const [billTypeId, setBillTypeId] = useState('');
  const [billTypes, setBillTypes] = useState([]);
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('paid');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [description, setDescription] = useState('');

  // States for loading, success, and error
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageType, setMessageType] = useState(''); 

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

      setBillTypeId(''); 
      setAmount(''); 
      setStartDate(''); 
      setEndDate('');
      setStatus(''); 
      setPaymentMethod(''); 
      setDescription('');
    } catch (err) {
      setLoading(false);
      // use backend error message if available
      const resMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(resMessage);
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
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label htmlFor="amount" className="block text-sm font-medium text-white-700 dark:text-white-700">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onWheel={(e)=>e.target.blur()}
              className=" bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"                
              step="1"
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-full">
              <label htmlFor="startDate" className=" dark:text-gray-300 block text-sm font-medium text-white-700">Start Date</label>
              <SmartDateInput
                id="startDate"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="endDate" className="dark:text-gray-300 block text-sm font-medium text-white-700">End Date</label>
              <SmartDateInput
                id="endDate"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="dark:text-gray-300 block text-sm font-medium text-white-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => validateDescription(e.target.value)}
              className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-full">
              <label htmlFor="status" className="dark:text-gray-300 block text-sm font-medium text-white-700">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="w-full">
              <label htmlFor="paymentMethod" className="dark:text-gray-300 block text-sm font-medium text-white-700">Payment Method</label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select Payment Method</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Mobile">Mobile Banking</option>
                <option value="telebirr">Telebirr</option>
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
          messageType={messageType} 
          message={message || error} 
        />
      )}
    </>
  );
};

export default AddGovBillPayment;