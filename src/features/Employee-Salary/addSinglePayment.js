import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';


const SalaryPaymentForm = () => {
  // States for form and API responses
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentFromDate, setPaymentFromDate] = useState('2025-03-01T00:00:00Z');
  const [paymentToDate, setPaymentToDate] = useState('2025-03-31T23:59:59Z');
  const [status, setStatus] = useState('Paid');
  const [allowance, setAllowance] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch employees when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${process.env.REACT_APP_BASE_URL}auth/employee`, {
        headers: {
            Authorization: `Bearer ${token}`, // Pass the token in Authorization header
          }
    })
      .then(response => {
        const employeeData = response.data.users; // Use "users" as per the API response
        setEmployees(employeeData);
        console.log(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching employees:", error);
      });
  }, []);

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct payload for salary payment
    const payload = {
      employeeId,
      paymentMethod,
      paymentFromDate,
      paymentToDate,
      status,
      allowance
    };

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Make the POST request with token in the Authorization header
    axios.post(`${process.env.REACT_APP_BASE_URL}salary-payments/pay`, payload, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in Authorization header
      }
    })
      .then(response => {
        setResponseMessage(response.data.message); // Show success message
        // Optionally reset form after success
        setEmployeeId('');
        setPaymentMethod('bank_transfer');
        setPaymentFromDate('2025-03-01T00:00:00Z');
        setPaymentToDate('2025-03-31T23:59:59Z');
        setStatus('Paid');
        setAllowance('');

        setModalOpen(true);
        setMessageType('success');
        setMessage('Add single salary payment successfully!')
        window.location.href='/app/view-all-salary';
      })
      .catch(error => {

        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to Add single salary payment!')
      });
  };

  return (
    <>
      <TitleCard title={'Single Salary Payment'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee Dropdown */}
        <div>
          <label htmlFor="employeeId" className="block text-sm font-medium text-white-700">Employee</label>
          <select
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="mt-1 bg-base-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fname} {employee.lname} {/* Display first and last name */}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-white-700">Payment Method</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 bg-base-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="check">Check</option>
          </select>
        </div>

        {/* Payment From Date */}
        <div>
          <label htmlFor="paymentFromDate" className="block text-sm font-medium text-white-700">Payment From Date</label>
          <input
            type="date"
            id="paymentFromDate"
            value={paymentFromDate}
            onChange={(e) => setPaymentFromDate(e.target.value)}
            className="mt-1 block bg-base-100 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Payment To Date */}
        <div>
          <label htmlFor="paymentToDate" className="block text-sm font-medium text-white-700">Payment To Date</label>
          <input
            type="date"
            id="paymentToDate"
            value={paymentToDate}
            onChange={(e) => setPaymentToDate(e.target.value)}
            className="mt-1 bg-base-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-white-700">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 bg-base-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Allowance */}
        <div>
          <label htmlFor="allowance" className="block text-sm font-medium text-white-700">Allowance</label>
          <input
            type="number"
            id="allowance"
            value={allowance}
            onChange={(e) => setAllowance(Number(e.target.value))}
            className="mt-1 bg-base-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit Payment
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
