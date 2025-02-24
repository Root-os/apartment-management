import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import TableComponent from '../../components/table';
import {FaSearch} from 'react-icons/fa';

const GovBillPaymentPage = () => {
  const [billPayments, setBillPayments] = useState([]);
  const [billTypes, setBillTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [editData, setEditData] = useState({
    billTypeId: '',
    amount: '',
    startDate: '',
    endDate: '',
    status: '',
    paymentMethod: '',
    description: '',
  });

  useEffect(() => {
    const fetchBillPayments = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/bill-payments');
        setBillPayments(response.data);
      } catch (err) {
        setError('An error occurred while fetching the bill payments.');
      } finally {
        setLoading(false);
      }
    };

    const fetchBillTypes = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/bill-type');
        setBillTypes(response.data);
      } catch (err) {
        setError('An error occurred while fetching the bill types.');
      }
    };

    fetchBillPayments();
    fetchBillTypes();
  }, []);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleSearchClick = async () => {
    try {
      let response;
      if (selectedStatus === "paid") {
        response = await axios.get('https://apartment.houseethiopia.com/api/bill-payments/by-status/paid');
      } else if (selectedStatus === "unpaid") {
        response = await axios.get('https://apartment.houseethiopia.com/api/bill-payments/by-status/unpaid');
      } else {
        response = await axios.get('https://apartment.houseethiopia.com/api/bill-payments');
      }
      if (response.data.length === 0) {
        setError('No bills found.');
      } else {
        setError(null);
      }
      setBillPayments(response.data);
    } catch (err) {
      setError('An error occurred while fetching the bill payments.');
    }
  };

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
      await axios.put(`https://apartment.houseethiopia.com/api/bill-payments/${selectedPayment.id}`, editData);
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
      await axios.delete(`https://apartment.houseethiopia.com/api/bill-payments/${selectedPayment.id}`);
      setBillPayments(billPayments.filter((payment) => payment.id !== selectedPayment.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('An error occurred while deleting the bill payment.');
    }
  };

  const columns = [
    {
      label: "Bill Type",
      key: "BillPaymentType.typeName",
      Cell: ({ row }) => row.BillPaymentType ? row.BillPaymentType.typeName : 'N/A',
    },
    {
      label: "Amount",
      key: "amount",
    },
    {
      label: "Start Date",
      key: "startDate",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      label: "End Date",
      key: "endDate",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      label: "Status",
      key: "status",
    },
    {
      label: "Payment Method",
      key: "paymentMethod",
    },
    {
      label: "Description",
      key: "description",
    },
    {
      label: "Actions",
      key: "actions",
      render: (row ) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white py-1 px-2 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white py-1 px-2 rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const statusFilter = (
    <div className="flex items-center mb-4">
      <select
        value={selectedStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="mr-2 px-4 py-2 rounded bg-gray-200 text-black"
      >
        <option value="">Select Status</option>
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
      </select>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSearchClick}
      >
        <FaSearch /> Search
      </button>
    </div>
  );
  const handleAddClick = () => {
    window.location.href = '/payment-government-add'
  };

  return (
    <div className="p-6">

      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 border border-red-400 rounded-md">
          {error}
        </div>
      )}
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
        statusFilter={statusFilter}
        onAdd={handleAddClick}
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
          <div className="bg-base-100  p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
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
                <option value="unPaid">unPaid</option>
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
          <div className="bg-base-100 p-6 rounded-lg w-96">
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