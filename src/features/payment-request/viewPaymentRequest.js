import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const PaymentRequestsPage = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [billTypes, setBillTypes] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [repeatedFor, setRepeatedFor] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [billPaymentTypeId, setBillPaymentTypeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');

  // Fetch data from the API
  useEffect(() => {
    axios
      .get('https://apartment.houseethiopia.com/api/payment-requests')
      .then((response) => {
        setPaymentRequests(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the payment requests:', error);
      });

    axios
      .get('https://apartment.houseethiopia.com/api/tenant')
      .then((response) => {
        setTenants(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the tenants:', error);
      });

    axios
      .get('https://apartment.houseethiopia.com/api/bill-type')
      .then((response) => {
        setBillTypes(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the bill types:', error);
      });
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
    setBillPaymentTypeId(request.billPaymentTypeId);
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
        repeatedFor,
        tenantId,
        billPaymentTypeId,
      };

      const response = await axios.put(`https://apartment.houseethiopia.com/api/payment-requests/${selectedRequest.id}`, updatedRequest);
      const updatedData = paymentRequests.map((request) =>
        request.id === selectedRequest.id ? response.data : request
      );
      setPaymentRequests(updatedData);
      setIsEditModalOpen(false);
      setSelectedRequest(null);

      setModalOpen(true);
      setMessageType('success');
      setModalMessage('Payment request updated successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setModalMessage('Unable to update payment request');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`https://apartment.houseethiopia.com/api/payment-requests/${selectedRequest.id}`);
      setPaymentRequests(paymentRequests.filter((request) => request.id !== selectedRequest.id));
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
      key: 'billPaymentTypeId',
      label: 'Bill Payment Type',
      render: (row) => {
        const billType = billTypes.find((type) => type.id === row.billPaymentTypeId);
        return billType ? billType.typeName : 'Unknown';
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
      render: (row) => new Date(row.dueDate).toLocaleDateString(), // Format due date
    },
    { key: 'repeatedFor', label: 'Repeated For' },
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

  return (
    <div>
      <TableComponent
        title="Payment Requests List"
        data={paymentRequests}
        columns={columns}
        exportable={true}
        showSearch={true}
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
          <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Payment Request</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="tenantId" className="block text-sm font-medium text-white-700">
                  Tenant Name
                </label>
                <select
                  id="tenantId"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="billPaymentTypeId" className="block text-sm font-medium text-white-700">
                  Bill Payment Type
                </label>
                <select
                  id="billPaymentTypeId"
                  value={billPaymentTypeId}
                  onChange={(e) => setBillPaymentTypeId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Bill Payment Type</option>
                  {billTypes.map((billType) => (
                    <option key={billType.id} value={billType.id}>
                      {billType.typeName}
                    </option>
                  ))}
                </select>
              </div>
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
              <div className="mb-4">
                <label htmlFor="level" className="block text-sm font-medium text-white-700">
                  Level
                </label>
                <input
                  type="text"
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-white-700">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
              <div className="mb-4">
                <label htmlFor="repeatedFor" className="block text-sm font-medium text-white-700">
                  Repeated For
                </label>
                <input
                  type="text"
                  id="repeatedFor"
                  value={repeatedFor}
                  onChange={(e) => setRepeatedFor(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Save
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