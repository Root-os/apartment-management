import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Bill Payments</h1>
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
        <>
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-base-100 text-white">
              <tr>
                <th className="p-3 border-b text-left">Bill Type</th>
                <th className="p-3 border-b text-left">Amount</th>
                <th className="p-3 border-b text-left">Start Date</th>
                <th className="p-3 border-b text-left">End Date</th>
                <th className="p-3 border-b text-left">Status</th>
                <th className="p-3 border-b text-left">Payment Method</th>
                <th className="p-3 border-b text-left">Description</th>
                <th className="p-3 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billPayments.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td className="p-3">{payment.BillPaymentType.typeName}</td>
                  <td className="p-3">{payment.amount}</td>
                  <td className="p-3">{new Date(payment.startDate).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(payment.endDate).toLocaleDateString()}</td>
                  <td className="p-3">{payment.status || 'N/A'}</td>
                  <td className="p-3">{payment.paymentMethod}</td>
                  <td className="p-3">{payment.description}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEditClick(payment)}
                      className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(payment)}
                      className="bg-red-500 text-white py-1 px-4 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          contentLabel="Edit Bill Payment"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
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
          <div className="bg-white p-6 rounded-lg w-96">
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