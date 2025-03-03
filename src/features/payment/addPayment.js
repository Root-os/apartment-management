import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const PaymentAdd = () => {
  // State variables for form inputs
  const [vendorId, setVendorId] = useState('');
  const [price, setPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [status, setStatus] = useState('');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch vendors
    axios
      .get(`${process.env.REACT_APP_BASE_URL}vendors`)
      .then((response) => {
        setVendors(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the vendors:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Reset messages before submitting
    setMessage('');
    setError('');
  
    // Check if all fields are filled
    if (!vendorId || !price || !paymentMethod || !status) {
      setError('All fields are required');
      return;
    }
  
    // Set loading state to true when sending the request
    setLoading(true);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}payments`, {
        vendorId,
        price,
        paymentMethod,
        status,
      });
  
      setVendorId('');
      setPrice('');
      setPaymentMethod('');
      setStatus('');
  
      setModalOpen(true);
      setMessageType('success');
      setMessage('Payment added successfully.');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setModalOpen(true);
          setMessageType('error');
          setMessage(error.response.data?.message || 'Unable to add payment due to invalid data.');
        } else if (error.response.status === 404) {
          // Handle 404 error explicitly
          setModalOpen(true);
          setMessageType('error');
          setMessage(error.response.data?.message || 'Purchase not found for the vendor.');
        } else {
          setModalOpen(true);
          setMessageType('error');
          setMessage('An error occurred. Please try again.');
        }
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
      <TitleCard title="Add Payment">
        {/* Form to input payment data */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="vendorId" className="block text-sm font-medium text-white-700">
              Vendor
            </label>
            <select
              id="vendorId"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="" disabled>
                Select Vendor
              </option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.fname} {vendor.lname}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-white-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-white-700">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="" disabled>
                Select Payment Method
              </option>
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-white-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="complete">Complete</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
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

export default PaymentAdd;