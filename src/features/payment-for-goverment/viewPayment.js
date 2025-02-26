import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from 'react-modal';

const GovBillPaymentPage = () => {
  const [billPayments, setBillPayments] = useState([]);
  const [billTypes, setBillTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editData, setEditData] = useState({
    billTypeId: '',
    amount: '',
    startDate: '',
    endDate: '',
    status: '',
    paymentMethod: '',
    description: '',
  });
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetchBillPayments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}bill-payments`);
        setBillPayments(response.data);
      } catch (err) {
        setError('An error occurred while fetching the bill payments.');
      } finally {
        setLoading(false);
      }
    };

    const fetchBillTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}bill-type`);
        setBillTypes(response.data);
      } catch (err) {
        setError('An error occurred while fetching the bill types.');
      }
    };

    fetchBillPayments();
    fetchBillTypes();
  }, []);

  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setEditData({
      billTypeId: payment.billTypeId,
      amount: payment.amount,
      startDate: payment.startDate,
      endDate: payment.endDate,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      description: payment.description,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}bill-payments/${selectedPayment.id}`, editData);
      setBillPayments(billPayments.map((payment) => (payment.id === selectedPayment.id ? { ...payment, ...editData } : payment)));
      setIsEditModalOpen(false);
    } catch (err) {
      setError('An error occurred while updating the bill payment.');
    }
  };

  const handleDeleteClick = (payment) => {
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}bill-payments/${selectedPayment.id}`);
      setBillPayments(billPayments.filter((payment) => payment.id !== selectedPayment.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('An error occurred while deleting the bill payment.');
    }
  };

  const handleFilterChange = async (e) => {
    const status = e.target.value;
    setFilterStatus(status);

    if (status) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}bill-payments/by-status/${status}`);
        setBillPayments(response.data);
      } catch (err) {
        setError('An error occurred while filtering the bill payments.');
      }
    } else {
      // Fetch all bill payments if no status is selected
      const fetchBillPayments = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}bill-payments`);
          setBillPayments(response.data);
        } catch (err) {
          setError('An error occurred while fetching the bill payments.');
        } finally {
          setLoading(false);
        }
      };

      fetchBillPayments();
    }
  };

  const columns = [
    { key: 'billType', label: 'Bill Type', render: (payment) => payment.BillType?.typeName },
    { key: 'amount', label: 'Amount' },
    { key: 'startDate', label: 'Start Date', render: (payment) => new Date(payment.startDate).toLocaleDateString() },
    { key: 'endDate', label: 'End Date', render: (payment) => new Date(payment.endDate).toLocaleDateString() },
    { key: 'status', label: 'Status' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'description', label: 'Description' },
    {
      key: 'actions',
      label: 'Actions',
      render: (payment) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditClick(payment)}
            className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(payment)}
            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Bill Payments</h1>
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 border border-red-400 rounded-md">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status</label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={handleFilterChange}
          className=" mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <TableComponent
          title="Bill Payments"
          data={billPayments}
          columns={columns}
          rowsPerPageOptions={[5, 10, 15]}
          showSearch={true}
          exportable={true}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          contentLabel="Edit Bill Payment"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl mb-4">Edit Bill Payment</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Bill Type</label>
              <select
                value={editData.billTypeId}
                onChange={(e) => setEditData({ ...editData, billTypeId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {billTypes.map((billType) => (
                  <option key={billType.id} value={billType.id}>
                    {billType.typeName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                value={editData.amount}
                onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={editData.startDate}
                onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={editData.endDate}
                onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <input
                type="text"
                value={editData.paymentMethod}
                onChange={(e) => setEditData({ ...editData, paymentMethod: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={() => setIsDeleteModalOpen(false)}
          contentLabel="Delete Confirmation"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-lg mx-4">
            <h2 className="text-xl mb-4">Are you sure you want to delete this bill payment?</h2>
            <div className="flex justify-between">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GovBillPaymentPage;