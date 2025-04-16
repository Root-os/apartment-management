import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const PaymentRequestsPage = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]); 
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');
  const [repeatedFor, setRepeatedFor] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [paymentTypeId, setPaymentTypeId] = useState('');  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('status');
  const [modalMessage, setModalMessage] = useState('');

  
  const fetchData = () => {
    setPageLoading(true); // Set loading to true when the fetch starts
  
    // Use Promise.all to wait for all requests to finish
    Promise.all([
      axios.get(`${process.env.REACT_APP_BASE_URL}payment-requests`),
      axios.get(`${process.env.REACT_APP_BASE_URL}tenant`),
      axios.get(`${process.env.REACT_APP_BASE_URL}payment-types`)
    ])
      .then((responses) => {
        // Destructure the responses and set the state accordingly
        const [paymentRequestsResponse, tenantsResponse, paymentTypesResponse] = responses;
  
        setPaymentRequests(paymentRequestsResponse.data);
        setTenants(tenantsResponse.data);
        setPaymentTypes(paymentTypesResponse.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the data:', error);
      })
      .finally(() => {
        setPageLoading(false); // Set loading to false when all requests have finished
      });
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  

  // Handle edit button click
  const handleEditClick = (request) => {
    setSelectedRequest(request);
    setMessage(request.message);
    setLevel(request.level);
    setAmount(request.amount);
    setDueDate(new Date(request.dueDate).toISOString().split('T')[0]); // Convert date to YYYY-MM-DD format
    setRepeatedFor(request.repeatedFor);
    setTenantId(request.tenantId);
    setPaymentTypeId(request.paymentTypeId);  // Updated field
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (request) => {
    setSelectedRequest(request);
    setIsDeleteModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedRequest = {
        message,
        level,
        amount,
        dueDate,
        status,
        // repeatedFor,
        // tenantId,
        // paymentTypeId,  // Updated field
      };

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}payment-requests/${selectedRequest.id}`, updatedRequest);
      // Re-fetch data after statusful edit
      fetchData();
      setIsEditModalOpen(false);
      setSelectedRequest(null);

      setModalOpen(true);
      setMessageType('success');
      setModalMessage('Payment request updated successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setModalMessage('Unable to update payment request. check the due date, should be in the future');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}payment-requests/${selectedRequest.id}`);
      // Re-fetch data after statusful delete
      fetchData();
      setIsDeleteModalOpen(false);
      setSelectedRequest(null);

      setModalOpen(true);
      setMessageType('success');
      setModalMessage('Payment request deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setModalMessage('Unable to delete payment request');
    } finally {
      setLoading(false);
    }
  };

  // Columns configuration for TableComponent
  const columns = [
    {
      key: 'tenantId',
      label: 'Tenant Name',
      render: (row) => {
        const tenant = tenants.find((tenant) => tenant.id === row.tenantId);
        return tenant ? tenant.fullName : 'Unknown';
      },
    },
    {
      key: 'paymentTypeId',  // Updated key
      label: 'Payment Type',  // Updated label
      render: (row) => {
        const paymentType = paymentTypes.find((type) => type.id === row.paymentTypeId);  // Updated field
        return paymentType ? paymentType.name : 'Unknown';  // Updated field
      },
    },
    { key: 'message', label: 'Message' },
    { key: 'level', label: 'Level' },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => `${parseFloat(row.amount).toFixed(2)}`, // Format amount to 2 decimal places
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (row) => new Date(row.dueDate).toLocaleDateString(),
    },
    { key: 'repeatedFor', label: 'Repeated For' },
    { key: 'status', label: 'Status ' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  const handleAddClick = () => {
    window.location.href = '/app/payment-request-add';
   };

  return (
    <div>
       {pageLoading ? (<LoadingComponent/>):(
      <TableComponent
        title="Tenant Payment Requests"
        data={paymentRequests}
        columns={columns}
        exportable={true}
        showSearch={true}
        onAdd={handleAddClick}
      />
    )}
      
      {isEditModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
    <div className="bg-base-100 p-6 rounded-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Payment Request</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
        
        {/* Message Input */}
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-white-700">
            Message
          </label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Level Dropdown */}
        <div className="mb-4">
          <label htmlFor="level" className="block text-sm font-medium text-white-700">
            Level
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Level</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-white-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Due Date Input */}
        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-sm font-medium text-white-700">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Dropdown */}
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-white-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this payment request?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={modalMessage}
      />
    </div>
  );
};

export default PaymentRequestsPage;
