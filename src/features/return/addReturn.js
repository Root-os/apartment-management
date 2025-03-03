import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddReturn = () => {
  // State variables for form inputs
  const [vendorId, setVendorId] = useState('');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
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

    // Fetch items
    axios
      .get(`${process.env.REACT_APP_BASE_URL}items`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the items:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Reset messages before submitting
    setMessage('');
    setError('');
  
    // Check if all fields are filled
    if (!vendorId || !itemId || !quantity || !reason) {
      setError('All fields are required');
      return;
    }
  
    // Set loading state to true when sending the request
    setLoading(true);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}returns`, {
        vendorId,
        itemId,
        quantity,
        reason,
      });
  
      setVendorId('');
      setItemId('');
      setQuantity('');
      setReason('');
  
      setModalOpen(true);
      setMessageType('success');
      setMessage('Return added successfully.');
    } catch (error) {
      if (error.response?.status === 400) {
        // Check for specific error message
        if (error.response.data?.message) {
          setModalOpen(true);
          setMessageType('error');
          setMessage(error.response.data.message);  // Use the specific error message
        } else {
          setModalOpen(true);
          setMessageType('error');
          setMessage('Unable to add return due to invalid data.');
        }
      } else {
        // Handle other errors
        setModalOpen(true);
        setMessageType('error');
        setMessage('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <TitleCard title="Add Return">
        {/* Form to input return data */}
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
            <label htmlFor="itemId" className="block text-sm font-medium text-white-700">
              Item
            </label>
            <select
              id="itemId"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="" disabled>
                Select Item
              </option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.itemName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-white-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-white-700">
              Reason
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            ></textarea>
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

export default AddReturn;