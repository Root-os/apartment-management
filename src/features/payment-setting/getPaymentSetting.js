import React, { useState, useEffect } from "react";
import api from '../../utils/api';
import TableComponent from "../../components/table";
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const PaymentSettings = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [newPaymentData, setNewPaymentData] = useState({
    paymentMethod: '',
    receiverName: '',
    receiverAccountNumber: ''
  });

  // Fetch payment settings
  useEffect(() => {
    api.get('payment-settings')
      .then(response => {
        setPayments(response.data.data);
      })
      .catch(error => console.error("Error fetching payment settings:", error))
      .finally(() => setLoading(false));
  }, []);

  // Edit payment
  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setNewPaymentData({
      paymentMethod: payment.paymentMethod,
      receiverName: payment.receiverName,
      receiverAccountNumber: payment.receiverAccountNumber
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    setButtonLoading(true);
    api.put(`payment-settings/${selectedPayment.id}`, newPaymentData)
      .then(() => {
        setPayments(payments.map(p => p.id === selectedPayment.id ? { ...p, ...newPaymentData } : p));
        setIsEditModalOpen(false);
        setModalOpen(true);
        setMessageType('success');
        setMessage('Payment settings updated successfully');
      })
      .catch(error => {
        setModalOpen(true);
        setMessageType('error');
        setMessage(error.response?.data?.message || error.message || 'Unknown error');
      })
      .finally(() => setButtonLoading(false));
  };

  // Delete payment
  const handleDeleteClick = (payment) => {
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setButtonLoading(true);
    api.delete(`payment-settings/${selectedPayment.id}`)
      .then(() => {
        setPayments(payments.filter(p => p.id !== selectedPayment.id));
        setIsDeleteModalOpen(false);
        setModalOpen(true);
        setMessageType('success');
        setMessage('Payment settings deleted successfully');
      })
      .catch(() => {
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to delete, please try again');
      })
      .finally(() => setButtonLoading(false));
  };

  // Detail payment
  const handleDetailClick = (payment) => {
    setPaymentDetails(payment);
    setIsDetailModalOpen(true);
  };

  const columns = [
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'receiverName', label: 'Receiver Name' },
    { key: 'receiverAccountNumber', label: 'Account Number' },
    {
      key: 'actions',
      label: 'Actions',
      render: (payment) => (
        <>
          <button
            onClick={() => handleEditClick(payment)}
            className="bg-blue-500 text-white py-1 px-2 rounded mr-1"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(payment)}
            className="bg-red-500 text-white py-1 px-2 rounded mr-1"
          >
            Delete
          </button>
          <button
            onClick={() => handleDetailClick(payment)}
            className="bg-gray-400 text-white py-1 px-2 rounded"
          >
            Detail
          </button>
        </>
      )
    }
  ];

  const handleAddClick = () => {
    window.location.href = '/app/add-payment-setting';
  };

  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <TableComponent
          title="Payment Settings"
          data={payments}
          columns={columns}
          showSearch={true}
          exportable={true}
          onAdd={handleAddClick}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Edit Payment Setting</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <input
                type="text"
                value={newPaymentData.paymentMethod}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, paymentMethod: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Receiver Name</label>
              <input
                type="text"
                value={newPaymentData.receiverName}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, receiverName: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Account Number</label>
              <input
                type="text"
                value={newPaymentData.receiverAccountNumber}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, receiverAccountNumber: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={buttonLoading}
              >
                {buttonLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Are you sure you want to delete this payment setting?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={buttonLoading}
              >
                {buttonLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && paymentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-base-100 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl mb-2">Payment Setting Detail</h2>
            <p><strong>Payment Method:</strong> {paymentDetails.paymentMethod}</p>
            <p><strong>Receiver Name:</strong> {paymentDetails.receiverName}</p>
            <p><strong>Account Number:</strong> {paymentDetails.receiverAccountNumber}</p>
            <p><strong>Created At:</strong> {new Date(paymentDetails.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(paymentDetails.updatedAt).toLocaleString()}</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setIsDetailModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default PaymentSettings;
