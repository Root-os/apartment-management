import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import Modal from '../../components/Modal';
import { CalendarContext } from '../../context/calendarContext';
import SmartDateInput from '../../components/Common/smartDatePicker';
import api from '../../utils/api';


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

 const {  formatDateForDisplay } = useContext(CalendarContext);

  useEffect(() => {
    const fetchBillPayments = async () => {
      try {
        const response = await api.get(`bill-payments`);
        setBillPayments(response.data);
      } catch (err) {
        setError('An error occurred while fetching the bill payments.');
      } finally {
        setLoading(false);
      }
    };

    const fetchBillTypes = async () => {
      try {
        const response = await api.get(`bill-type`);
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
      await api.put(`bill-payments/${selectedPayment.id}`, editData);
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
      await api.delete(`bill-payments/${selectedPayment.id}`);
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

  try {
    if (status) {
      const response = await api.get(`bill-payments/by-status/${status}`);

      // ✅ Always set array
      setBillPayments(Array.isArray(response.data) ? response.data : []);

      // Optional message
      if (response.data.length === 0) {
        setError(`No bill payments found with the status "${status}".`);
      } else {
        setError(null);
      }
    } else {
      const response = await api.get(`bill-payments`);
      setBillPayments(Array.isArray(response.data) ? response.data : []);
      setError(null);
    }
  } catch (err) {
    setBillPayments([]); // ✅ VERY IMPORTANT
    setError('An error occurred while filtering the bill payments.');
  }
};


const handleDetailClick = (payment) => {
  setSelectedDetail(payment); // Set the selected payment's details
  setIsDetailModalOpen(true); // Open the modal
};

  const columns = [
    { key: 'billType', label: 'Bill Type', render: (payment) => payment.BillType?.typeName },
    { key: 'amount', label: 'Amount' },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (payment) => payment.startDate ? formatDateForDisplay(payment.startDate) : '-'

    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (payment) => formatDateForDisplay(payment.endDate)
    },

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
    window.location.href = '/app/add-payment-for-goverment';
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
          title="Paid Bill Payments for Gov't"
          data={billPayments}
          columns={columns}
         rowsPerPageOptions={[5, 10, 15]}

          showSearch={true}
          // exportable={true}
          onAdd={handleAddClick}
          exportConfig={[
    {
      label: "Bill Type",
      getValue: (r) => r.BillType?.typeName ?? "N/A",
    },
    {
      label: "Amount",
      getValue: (r) => r.amount ?? "0",
    },
    {
      label: "Start Date",
      getValue: (r) =>
        r.startDate
          ? new Date(r.startDate).toLocaleDateString()
          : "N/A",
    },
    {
      label: "End Date",
      getValue: (r) =>
        r.endDate
          ? new Date(r.endDate).toLocaleDateString()
          : "N/A",
    },
    {
      label: "Status",
      getValue: (r) => r.status ?? "N/A",
    },
    {
      label: "Payment Method",
      getValue: (r) => r.paymentMethod ?? "N/A",
    },
    {
      label: "Description",
      getValue: (r) => r.description ?? "",
    },
  ]}
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
                  onWheel={(e)=> e.target.blur()}
                  className="w-full p-2 border border-gray-300 rounded bg-base-100"
                  min="0"
                  step="1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white-700 font-medium mb-2">Start Date</label>
                <SmartDateInput
                  value={editData.startDate}
                  onChange={(gcDate) => setEditData({ ...editData, startDate: gcDate })}
                  className="w-full p-2 border border-gray-300 rounded bg-base-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white-700 font-medium mb-2">End Date</label>
                <SmartDateInput
                  value={editData.endDate}
                  onChange={(gcDate) => setEditData({ ...editData, endDate: gcDate })}
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
                <p><strong>Start Date:</strong> {formatDateForDisplay(selectedDetail.startDate)}</p>
                <p><strong>End Date:</strong> {formatDateForDisplay(selectedDetail.endDate)}</p>
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
