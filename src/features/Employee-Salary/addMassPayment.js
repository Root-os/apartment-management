import React, { useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const MassSalaryPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentFromDate, setPaymentFromDate] = useState('');
  const [paymentToDate, setPaymentToDate] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const payload = {
      paymentMethod,
      paymentFromDate,
      paymentToDate,
      status,
    };
    const token = localStorage.getItem('token')
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}salary-payments/mass-pay`, payload, {
        headers : {Authorization: `Bearer ${token}`,}
      },);
      setModalOpen(true);
      setMessageType('success');
      setMessage('Add mass salary payment successfully!')
      window.location.href='/app/view-all-salary';

      setStatus(''); 
      setPaymentToDate(''); 
      setPaymentFromDate(''); 
      setPaymentMethod('');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to Add mass salary payment!')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TitleCard title={'Add Mass Employee Salary'} topMargin={'mt-1'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment Method */}
        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-white-700">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">select</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
          </select>
        </div>

        {/* Payment From Date */}
        <div>
          <label htmlFor="paymentFromDate" className="block text-sm font-medium text-white-700">
            Payment From Date
          </label>
          <input
            type="date"
            id="paymentFromDate"
            value={paymentFromDate}
            onChange={(e) => setPaymentFromDate(e.target.value)}
             className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Payment To Date */}
        <div>
          <label htmlFor="paymentToDate" className="block text-sm font-medium text-white-700">
            Payment To Date
          </label>
          <input
            type="date"
            id="paymentToDate"
            value={paymentToDate}
            onChange={(e) => setPaymentToDate(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-white-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-base-100 w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">select</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Submit Payment'}
          </button>
        </div>
      </form>
      </TitleCard>

     <Modal
     isOpen={modalOpen}
     onClose={()=> setModalOpen(false)}
     messageType={messageType}
     message={message}
     
     />
    </>
  );
};

export default MassSalaryPayment;
