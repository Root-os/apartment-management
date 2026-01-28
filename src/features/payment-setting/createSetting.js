import React, { useState } from 'react';
import api from '../../utils/api';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const PaymentSettingForm = () => {
  const [loading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    paymentMethod: '',
    receiverName: '',
    receiverAccountNumber: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const response = await api.post('payment-settings', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Reset form
      setFormData({
        paymentMethod: '',
        receiverName: '',
        receiverAccountNumber: ''
      });

      setModalOpen(true);
      setMessageType('success');
      setMessage(response.data.message || 'Payment setting created successfully');
    } catch (error) {
      console.error('Error creating payment setting:', error);
      const backendError = error.response?.data?.error || error.response?.data?.message || 'Something went wrong. Please try again.';

      setModalOpen(true);
      setMessageType('error');
      setMessage(backendError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Register New Payment Setting" topMargin="mt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="paymentMethod" className="text-sm font-medium text-white-700">
              Payment Method
            </label>
            <input
              type="text"
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              required
              className="bg-base-100 mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="receiverName" className="text-sm font-medium text-white-700">
              Receiver Name
            </label>
            <input
              type="text"
              id="receiverName"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleInputChange}
              required
              className="bg-base-100 mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="receiverAccountNumber" className="text-sm font-medium text-white-700">
              Account Number
            </label>
            <input
              type="text"
              id="receiverAccountNumber"
              name="receiverAccountNumber"
              value={formData.receiverAccountNumber}
              onChange={handleInputChange}
              required
              className="bg-base-100 mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 w-full text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? 'Submitting...' : 'Add Payment Setting'}
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

export default PaymentSettingForm;
