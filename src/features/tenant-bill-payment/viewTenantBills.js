import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const ViewBillPayment = () => {
  const [payments, setPayments] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newPaymentData, setNewPaymentData] = useState({
    tenantId: '',
    billPaymentTypeId: '',
    amount: '',
    startDate: '',
    endDate: '',
    status: ''
  });

  // Fetch payments
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}tenant-payments`)
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        console.error("Error fetching payments:", error);
      });
  }, []);

  // Edit payment
  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setNewPaymentData({
      tenantId: payment.tenantId,
      billPaymentTypeId: payment.billPaymentTypeId,
      amount: payment.amount,
      startDate: payment.startDate,
      endDate: payment.endDate,
      status: payment.status,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    axios.put(`${process.env.REACT_APP_BASE_URL}tenant-payments/${selectedPayment.id}`, newPaymentData)
      .then(() => {
        setPayments(payments.map(payment => (payment.id === selectedPayment.id ? { ...payment, ...newPaymentData } : payment)));
        setIsEditModalOpen(false);
        setModalMessage('Payment updated successfully!');
        setIsSuccessModalOpen(true);
      })
      .catch(error => {
        console.error("Error updating payment:", error);
        setModalMessage('Error updating payment. Please try again.');
        setIsErrorModalOpen(true);
      });
  };

  // Delete payment
  const handleDeleteClick = (payment) => {
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    axios.delete(`${process.env.REACT_APP_BASE_URL}tenant-payments/${selectedPayment.id}`)
      .then(() => {
        setPayments(payments.filter(payment => payment.id !== selectedPayment.id));
        setIsDeleteModalOpen(false);
        setModalMessage('Payment deleted successfully!');
        setIsSuccessModalOpen(true);
      })
      .catch(error => {
        console.error("Error deleting payment:", error);
        setIsDeleteModalOpen(false);
        setModalMessage('Error deleting payment. Please try again.');
        setIsErrorModalOpen(true);
      });
  };

  // Detail payment
  const handleDetailClick = (payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  const columns = [
    { key: 'tenantName', label: 'Tenant Name', render: (payment) => payment.Tenant.fullName },
    { key: 'unitNumber', label: 'Unit Number', render: (payment) => payment.Tenant.Unit.unitNumber },
    { key: 'floorNumber', label: 'Floor Number', render: (payment) => payment.Tenant.Floor.floorNumber },
    { key: 'status', label: 'Status' },
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
          <button
            onClick={() => handleDetailClick(payment)}
            className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-700"
          >
            Detail
          </button>
        </div>
      )
    }
  ];

  const handleAddClick = () => {
    console.log("Add button clicked");
  };

  return (
    <div className="p-8">
      <TableComponent
        title="Bill Payments"
        data={payments}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
        onAdd={handleAddClick}
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Edit Payment</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                value={newPaymentData.amount}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, amount: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={newPaymentData.startDate}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, startDate: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={newPaymentData.endDate}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, endDate: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={newPaymentData.status}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, status: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleEditSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Are you sure you want to delete this payment?</h2>
            <div className="flex justify-between">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDeleteConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl mb-4">Payment Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong>Tenant Name:</strong> {selectedPayment.Tenant.fullName}</p>
              <p><strong>Unit Number:</strong> {selectedPayment.Tenant.Unit.unitNumber}</p>
              <p><strong>Floor Number:</strong> {selectedPayment.Tenant.Floor.floorNumber}</p>
              <p><strong>Bill Payment Type:</strong> {selectedPayment.BillPaymentType.typeName}</p>
              <p><strong>Amount:</strong> {selectedPayment.amount}</p>
              <p><strong>Start Date:</strong> {new Date(selectedPayment.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(selectedPayment.endDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedPayment.status}</p>
             
             
              <p><strong>Document:</strong> <a href={selectedPayment.Tenant.document} target="_blank" rel="noopener noreferrer" className="text-blue-500">View Document</a></p>
              <p><strong>Lease End Date:</strong> {new Date(selectedPayment.Tenant.leaseEndDate).toLocaleDateString()}</p>
              <p><strong>Remaining Days:</strong> {selectedPayment.Tenant.remainingDays}</p>
            </div>
            <div className="flex justify-center mt-4">
              <button onClick={() => setIsDetailModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} type="success" message={modalMessage} />
      )}

      {/* Error Modal */}
      {isErrorModalOpen && (
        <Modal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)} type="error" message={modalMessage} />
      )}
    </div>
  );
};

export default ViewBillPayment;