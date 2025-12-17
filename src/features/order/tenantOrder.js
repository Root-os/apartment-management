import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import SmartDateInput from '../../components/Common/smartDatePicker';

Modal.setAppElement('#root'); 

const CreateOrder = ({ isOpen, onClose, orderTypeId }) => {
  const [orderDate, setOrderDate] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');


  const handleFileChange = (e) => {
    setReceiptImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderTypeId) {
      setMessageType('error');
      setMessage('Order type ID is missing.');
      return;
    }

    setLoading(true);
    setMessage('');
    
    const formData = new FormData();
    formData.append('orderDate', orderDate);
    formData.append('amount', amount);
    formData.append('notes', notes);
    formData.append('orderTypeId', orderTypeId);
    formData.append('receiptImage', receiptImage);

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}order`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessageType('success');
      setMessage('Order created successfully.');
      onClose();
    } catch (error) {
      setMessageType('error');
      setMessage('Unable to create order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Create Order" className="custom-modal" overlayClassName="custom-overlay">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Create Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700">
              Order Date
            </label>
            <SmartDateInput
              id="orderDate"
              value={orderDate}
              onChange={(date) => setOrderDate(date)}
              className="mt-1 bg-white block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onWheel={(e)=> e.target.blur()}
              min="0"
              className="mt-1 bg-white block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 bg-white block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="receiptImage" className="block text-sm font-medium text-gray-700">
              Receipt Image
            </label>
            <input
              type="file"
              id="receiptImage"
              onChange={handleFileChange}
              className="mt-1 bg-white block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
        {message && (
          <div className={`mt-4 text-${messageType === 'success' ? 'green' : 'red'}-500`}>
            {message}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreateOrder;