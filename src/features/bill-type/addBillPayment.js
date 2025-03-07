import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';
import TitleCard from '../../components/Cards/TitleCard';


const BillPaymentPage = () => {
  const [formData, setFormData] = useState({
    typeName: '',
    description: '',
  });
  const [responseData, setResponseData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}bill-type`,
        formData
      );
      setResponseData(response.data);
      setModalOpen(true);
      setMessageType('success');
      setMessage('Bill type added successfully');
      // window.location.href='/bill-type-view';
      // Reset form fields
      setFormData({
        typeName: '',
        description: '',
      });
    } catch (err) {
      // Handle any error that occurs during the POST request
      setModalOpen(true);
      setMessageType('error');
      setMessage('An error occurred while adding the bill payment type.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <TitleCard title="Add Bill Payment" topMargin={'mt-4'}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Type Name */}
        <div className="flex flex-col">
          <label htmlFor="typeName" className="text-sm font-medium text-white-700">
            Bill Type Name
          </label>
          <input
            type="text"
            id="typeName"
            name="typeName"
            value={formData.typeName}
            onChange={handleInputChange}
            className="bg-base-100 mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label htmlFor="description" className="text-sm font-medium text-white-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="bg-base-100 mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

export default BillPaymentPage;