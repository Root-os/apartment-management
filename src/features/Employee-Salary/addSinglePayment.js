import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';
import SmartDateInput from '../../components/Common/smartDatePicker';

const SalaryPaymentForm = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentFromDate, setPaymentFromDate] = useState('');
  const [paymentToDate, setPaymentToDate] = useState('');
  const [status, setStatus] = useState('Paid');
  const [allowance, setAllowance] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    
    axios.get(`${process.env.REACT_APP_BASE_URL}auth/employee`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      }
    })
      .then(response => {
        const employeeData = response.data.users;
        setEmployees(employeeData);
      })
      .catch(error => {
        console.error("There was an error fetching employees:", error);
        setModalOpen(true);
        setMessageType('error');
        setMessage('Failed to load employees');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!employeeId || !paymentFromDate || !paymentToDate) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate date range
    if (new Date(paymentToDate) <= new Date(paymentFromDate)) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Payment To Date must be after Payment From Date');
      setLoading(false);
      return;
    }

    const payload = {
      employeeId,
      paymentMethod,
      paymentFromDate: paymentFromDate.split('T')[0], // Send only date part
      paymentToDate: paymentToDate.split('T')[0],     // Send only date part
      status,
      allowance: allowance || 0
    };

    console.log('📤 Submitting payload:', payload); // Debug log

    const token = localStorage.getItem('token');

    axios.post(`${process.env.REACT_APP_BASE_URL}salary-payments/pay`, payload, {
      headers: {
        Authorization: `Bearer ${token}`, 
      }
    })
      .then(response => {
        setModalOpen(true);
        setMessageType('success');
        setMessage('Salary payment added successfully!');
        
        // Reset form
        setEmployeeId('');
        setPaymentMethod('bank_transfer');
        setPaymentFromDate('');
        setPaymentToDate('');
        setStatus('Paid');
        setAllowance('');
        
        // Redirect after delay
        setTimeout(() => {
          window.location.href = '/app/view-all-salary';
        }, 1500);
      })
      .catch(error => {
        console.error('❌ Error details:', error.response?.data);
        setModalOpen(true);
        setMessageType('error');
        setMessage(error.response?.data?.message || 'Unable to add salary payment!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <TitleCard title={'Add Single Employee Salary'} topMargin={'mt-1'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Dropdown */}
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-white-700">
              Employee
            </label>
            <select
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="mt-1 bg-base-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled={loading}
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fname} {employee.lname}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-white-700">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 bg-base-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled={loading}
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
            </select>
          </div>

          {/* Payment From Date */}
          <div>
            <label htmlFor="paymentFromDate" className="block text-sm font-medium text-white-700">
              Payment From Date
            </label>
            <SmartDateInput
              id="paymentFromDate"
              value={paymentFromDate}
              onChange={(date) => setPaymentFromDate(date)}
              className="mt-1 block bg-base-100 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled={loading}
            />
          </div>

          {/* Payment To Date */}
          <div>
            <label htmlFor="paymentToDate" className="block text-sm font-medium text-white-700">
              Payment To Date
            </label>
            <SmartDateInput
              id="paymentToDate"
              value={paymentToDate}
              onChange={(date) => setPaymentToDate(date)}
              className="mt-1 bg-base-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled={loading}
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
              className="mt-1 bg-base-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={loading}
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Allowance */}
          <div>
            <label htmlFor="allowance" className="block text-sm font-medium text-white-700">
              Allowance
            </label>
            <input
              type="number"
              id="allowance"
              min="0"
              step="1"
              value={allowance}
              onChange={(e) => setAllowance(e.target.value)}
              className="mt-1 bg-base-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Payment'}
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

export default SalaryPaymentForm;