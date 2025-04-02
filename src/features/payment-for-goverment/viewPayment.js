import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import Modal from '../../components/Modal';

const GovBillPaymentPage = () => {
  const [billPayments, setBillPayments] = useState([]);
  const [billTypes, setBillTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [editData, setEditData] = useState({
    billTypeId: '',
    amount: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    description: '',
  });
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null); 
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}bill-payments/${selectedPayment.id}`, editData);
      setBillPayments(billPayments.map((payment) => (payment.id === selectedPayment.id ? { ...payment, ...editData } : payment)));
      setIsEditModalOpen(false);
      setModalOpen(true);
      setMessageType('success');
      setMessage('Payment data updated successfully');
    } catch (err) {
      // setError('An error occurred while updating the bill payment.');
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update, please try again');
    } finally {
      setIsLoading(false);
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
      setModalOpen(true);
      setMessageType('success');
      setMessage('Payment data deleted successfully');
    } catch (err) {
      // setError('An error occurred while deleting the bill payment.');
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete, please try again');
    }
  };

 const handleFilterChange = async (e) => {
  const status = e.target.value;
  setFilterStatus(status);

  if (status) {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}bill-payments/by-status/${status}`);
      if (response.data.length === 0) {
        setError(`No bill payments found with the status "${status}". Please check again later.`);
      } else {
        setBillPayments(response.data);
        setError(null); // Clear any previous errors
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(`No bill payments found with the status "${status}".`);
      } else {
        setError('An error occurred while filtering the bill payments. Please try again later.');
      }
    }
  } else {
    // Fetch all bill payments if no status is selected
    const fetchBillPayments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}bill-payments`);
        setBillPayments(response.data);
      } catch (err) {
        setError('An error occurred while fetching the bill payments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBillPayments();
  }
};

const handleDetailClick = (payment) => {
  setSelectedDetail(payment); // Set the selected payment's details
  setIsDetailModalOpen(true); // Open the modal
};

  const columns = [
    { key: 'billType', label: 'Bill Type', render: (payment) => payment.BillType?.typeName },
    { key: 'amount', label: 'Amount' },
    // { key: 'startDate', label: 'Start Date', render: (payment) => new Date(payment.startDate).toLocaleDateString() },
    // { key: 'endDate', label: 'End Date', render: (payment) => new Date(payment.endDate).toLocaleDateString() },
    { key: 'status', label: 'Status' },
    { key: 'paymentMethod', label: 'Payment Method' },
    // { 
    //   key: 'description', 
    //   label: 'Description', 
    //   render: (payment) => (
    //     <div className="description-cell">
    //       {payment.description}
    //     </div>
    //   ) 
    // },
    {
      key: 'actions',
      label: 'Actions',
      render: (payment) => (
        <div className="flex space-x-1">
          <button
            onClick={() => handleEditClick(payment)}
            className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(payment)}
            className="bg-red-500 text-white py-1 px-4 rounded mr-2"
          >
            Delete
          </button>
          <button
          onClick={() => handleDetailClick(payment)}
          className="bg-gray-400 text-white py-1 px-2 rounded"
        >
          Detail
        </button>
        </div>
      )
    }
  ];

  const handleAddClick = () => {
    window.location.href = '/app/payment-goverment-add';
  };

  return (
    <>
    
      <div className="mb-4">
        <label htmlFor="filterStatus" className="block text-lg font-medium text-whute-700 dark:text-gray-300">Filter by Status</label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={handleFilterChange}
          className="bg-base-100 mt-1 px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center">
          <LoadingComponent />
        </div>
      ) : (
        <TableComponent
          title="Bill Payments"
          data={billPayments}
          columns={columns}
          rowsPerPageOptions={[5, 10, 15]}
          showSearch={true}
          exportable={true}
          onAdd={handleAddClick}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center mt-12">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl mb-4">Edit Bill Payment</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block font-medium mb-2 text-white-700">Bill Type</label>
                <select
                  value={editData.billTypeId}
                  onChange={(e) => setEditData({ ...editData, billTypeId: e.target.value })}
                  className="w-full bg-base-100 p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Select Bill Type</option>
                  {billTypes.map((billType) => (
                    <option key={billType.id} value={billType.id}>
                      {billType.typeName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-white-700">Amount</label>
                <input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-base-100"
                  min="0"
                  step="1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white-700 font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={editData.startDate}
                  onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-base-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white-700 font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={editData.endDate}
                  onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-base-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white-700 font-medium mb-2"></label>
                <select 
                  type="text"
                  value={editData.paymentMethod}
                  onChange={(e)=>setEditData({...editData, paymentMethod: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded bg-base-100">
                    <option value="bankTransfer">Bank</option>
                    <option value="Cash">Cash</option>
                    <option value="Mobile">Mobile</option>
                  </select>
              </div>
              <div className="mb-4">
                <label className="block text-white-700 font-medium mb-2">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-base-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white-700 font-medium mb-2">Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded bg-base-100"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this bill payment?</h2>
            <div className="flex justify-end space-x-2">
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
        </div>
      )}

        {isDetailModalOpen && selectedDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl mb-4">Bill Payment Details</h2>
              <div>
                <p><strong>Bill Type:</strong> {selectedDetail.BillType?.typeName}</p>
                <p><strong>Amount:</strong> {selectedDetail.amount}</p>
                <p><strong>Start Date:</strong> {new Date(selectedDetail.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(selectedDetail.endDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {selectedDetail.status}</p>
                <p><strong>Payment Method:</strong> {selectedDetail.paymentMethod}</p>
                <p><strong>Description:</strong> {selectedDetail.description}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsDetailModalOpen(false)} // Close the modal
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
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
    </>
  );
};

export default GovBillPaymentPage;
