import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import HistoryModal from './HistoryModal';
import SmartDateInput from "../../components/Common/smartDatePicker";
import { CalendarContext } from '../../context/calendarContext';

const RentCollectionPage = () => {
  const [rentData, setRentData] = useState([]);
  const [tenantData, setTenantData] = useState([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [tenantInfo, setTenantInfo] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentRent, setCurrentRent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [noDataMessage, setNoDataMessage] = useState(false);


  const [filterParams, setFilterParams] = useState({
    paymentDateFrom: '',
    paymentDateTo: '',
    nextDueDateFrom: '',
    nextDueDateTo: '',
    paymentFrequency: '',
    status: ''
  });

   const {  formatDateForDisplay } = useContext(CalendarContext);

  // Fetch Rent Collection Data
  const fetchRentData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}rent-collection`);
      setRentData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rent data:', error);
      setLoading(false);
    }
  };

  // Fetch Tenant Data
  const fetchTenantData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant`);
      setTenantData(response.data);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    }
  };

  useEffect(() => {
    fetchRentData();
    fetchTenantData();
  }, []);

  // Handle history modal open
  const openHistoryModal = async (tenantId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}rent-collection/${tenantId}`);
      setPaymentHistory(response.data.rentPayments);
      setTenantInfo(response.data.tenant);
      setHistoryModalOpen(true);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setModalMessage('Error fetching payment history. Please try again.');
      setIsErrorModalOpen(true);
    }
  };

  // Handle edit modal open
  const openEditModal = (rent) => {
    setCurrentRent(rent);
    setEditModalOpen(true);
  };

  // Handle delete modal open
  const openDeleteModal = (rentId) => {
    setCurrentRent(rentId);
    setDeleteModalOpen(true);
  };

  // Handle details modal open
  const openDetailsModal = (rent) => {
    setCurrentRent(rent);
    setDetailsModalOpen(true);
  };

  // Handle Close Modals
  const closeModals = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setDetailsModalOpen(false);
    setHistoryModalOpen(false);
  };

  // Handle Edit Form Submission (PUT Request)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedRent = {
        ...currentRent,
        // punishment: parseFloat(currentRent.punishment) || 0,
        isPaid: !!currentRent.isPaid, // ensure boolean
      };
      await axios.put(`${process.env.REACT_APP_BASE_URL}rent-collection/${currentRent.id}`, updatedRent);
      fetchRentData(); 
      closeModals();
      setModalOpen(true);
      setMessageType('success')
      setMessage('Rent updated successfully!');
    } catch (error) {
      console.error('Error updating rent data:', error);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Error updating rent. Please try again.');
     
    }
  };

  // Handle Rent Deletion (DELETE Request)
  const handleDeleteRent = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}rent-collection/${currentRent}`);
      fetchRentData();
      closeModals();
      setModalOpen(true);
      setMessageType('success')
      setMessage('Rent deleted successfully!');
    } catch (error) {
      console.error('Error deleting rent data:', error);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Error deleting rent data. Please try again.');
    }
  };

  const cleanFilterParams = (params) => {
    const cleaned = {};
    for (const key in params) {
      if (params[key] !== '') {
        cleaned[key] = params[key];
      }
    }
    return cleaned;
  };
  // Handle Filter Submit
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const cleanedParams = cleanFilterParams(filterParams); // Ensure this cleans the filter params
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}rent-collection/filter`, cleanedParams);
  
      console.log('Filter Response:', response.data); // Log the response data
      
      // Check if the response message indicates no data found
      if (response.data.message === "No rent collections found matching the filters") {
        setRentData([]);
        setNoDataMessage(true); // Set no data message flag
      } else {
        setRentData(response.data); // Set the filtered data
        setNoDataMessage(false); // Clear no data message flag
      }
    } catch (error) {
      console.error('Error filtering rent collections:', error);
      setNoDataMessage(true); // Set no data message flag in case of error
    } finally {
     
    }
  };
// For regular inputs
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFilterParams({ ...filterParams, [name]: value });
};

// For SmartDateInput components
const handleDateChange = (name) => (value) => {
  setFilterParams({ ...filterParams, [name]: value });
};

  const columns = [
    { key: 'tenantName', label: 'Tenant Name', render: (rent) => rent.Tenant.fullName },
    // { key: 'amountPaid', label: 'Amount Paid' },
    { 
      key: 'paymentDate', 
      label: 'paid from', 
      render: (rent) => new Date(rent.paymentDate).toISOString().split('T')[0] 
    },
    { 
      key: 'nextDueDate', 
      label: 'paid to', 
      render: (rent) => new Date(rent.nextDueDate).toISOString().split('T')[0] 
    },
    { key: 'status', label: 'Payment status'},
    { key: 'paidDays', label: 'paid days' },
    { key: 'amountPaid', label: 'Amount Paid', render: (data) => Math.ceil(data.amountPaid) },
    {
        key: 'actions',
        label: 'Actions',
        render: (rent) => (
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => openEditModal(rent)}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => openDeleteModal(rent.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => openDetailsModal(rent)}
              className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
            >
              Details
            </button>
            <button
              onClick={() => openHistoryModal(rent.tenantId)}
              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
            >
              Payment History
            </button>
          </div>
        )
      }
  ];

  return (
    <div className="p-8">
      <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="paymentDateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Date From</label>
          <SmartDateInput
            id="paymentDateFrom"
            name="paymentDateFrom"
            value={filterParams.paymentDateFrom}
            onChange={handleDateChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="paymentDateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Date To</label>
          <SmartDateInput
            id="paymentDateTo"
            name="paymentDateTo"
            value={filterParams.paymentDateTo}
            onChange={handleDateChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="nextDueDateFrom" className="dark:text-gray-300 block text-sm font-medium text-gray-700">Next Due Date From</label>
          <SmartDateInput
            id="nextDueDateFrom"
            name="nextDueDateFrom"
            value={filterParams.nextDueDateFrom}
            onChange={handleDateChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="nextDueDateTo" className="dark:text-gray-300 block text-sm font-medium text-gray-700">Next Due Date To</label>
          <SmartDateInput
            id="nextDueDateTo"
            name="nextDueDateTo"
            value={filterParams.nextDueDateTo}
            onChange={handleDateChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label htmlFor="paymentFrequency" className="dark:text-gray-300 block text-sm font-medium text-gray-700">Payment Frequency</label>
          <select
            id="paymentFrequency"
            name="paymentFrequency"
            value={filterParams.paymentFrequency}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Frequency</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className=" dark:text-gray-300 block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={filterParams.status}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
            Filter Data
          </button>
        </div>
      </form>

      <TableComponent
        title="Rent Collection"
        data={rentData}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      />

      {rentData.length === 0  && noDataMessage && (
        <p className="text-center text-gray-500 mt-4">No data available for the selected filters.</p>
      )}
      {/* History Modal */}
      {historyModalOpen && (
        <HistoryModal
          isOpen={historyModalOpen}
          onClose={closeModals}
          tenantInfo={tenantInfo}
          paymentHistory={paymentHistory}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-lg mx-4">
            <h2 className="text-xl mb-4">Edit Rent Collection</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tenant</label>
                <select
                  value={currentRent?.tenantId || ''}
                  onChange={(e) => setCurrentRent({ ...currentRent, tenantId: e.target.value })}
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Tenant</option>
                  {tenantData.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Amount Paid</label>
                <input
                  type="number"
                  value={currentRent?.amountPaid || ''}
                  onChange={(e) => setCurrentRent({ ...currentRent, amountPaid: e.target.value })}
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  value={currentRent?.paymentMethod || ''}
                  onChange={(e) => setCurrentRent({ ...currentRent, paymentMethod: e.target.value })}
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                  <option value="Mobile Banking">Mobile</option>
                </select>
              </div>
              {/* <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Payment Frequency</label>
                <select
                  value={currentRent?.paymentFrequency || ''}
                  onChange={(e) => setCurrentRent({ ...currentRent, paymentFrequency: e.target.value })}
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div> */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={currentRent?.status || ''}
                  onChange={(e) => setCurrentRent({ ...currentRent, status: e.target.value })}
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              {/* Punishment */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Punishment</label>
                <input
                  type="number"
                  value={currentRent?.punishment || 0}
                  onChange={(e) =>
                    setCurrentRent({ ...currentRent, punishment: parseFloat(e.target.value) })
                  }
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                />
              </div> */}

              {/* Is Paid */}
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={currentRent?.isPaid || false}
                  onChange={(e) =>
                    setCurrentRent({ ...currentRent, isPaid: e.target.checked })
                  }
                  className="mr-2"
                />
                <label htmlFor="isPaid" className="text-sm font-medium">Is Paid</label>
              </div>

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeModals} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-lg mx-4">
            <h2 className="text-xl mb-4">Are you sure you want to delete this rent collection?</h2>
            <div className="flex justify-end space-x-1">
              <button onClick={closeModals} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDeleteRent} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailsModalOpen && currentRent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-2xl mx-4">
            <h2 className="text-xl mb-4">Details for {currentRent.Tenant.fullName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong>Tenant Name:</strong> {currentRent.Tenant.fullName}</p>
              <p><strong>Phone Number:</strong> {currentRent.Tenant.phoneNumber}</p>
              <p><strong>Tenant Email:</strong> {currentRent.Tenant.email || 'No Email'}</p>
              <p><strong>Paid From:</strong> {formatDateForDisplay(currentRent.paymentDate)}</p>
              <p><strong>Floor Number:</strong> {currentRent.Tenant.Floor.floorNumber}</p>
              <p><strong>Paid To:</strong> {formatDateForDisplay(currentRent.nextDueDate)}</p>
              <p><strong>Unit Number:</strong> {currentRent.Tenant.Unit.unitNumber}</p>
              <p><strong>Paid Days:</strong> {currentRent.paidDays}</p>
              <p><strong>Next Due Date:</strong> {formatDateForDisplay(currentRent.nextDueDate)}</p>
              <p><strong>Payment Statuss:</strong> {currentRent.status}</p>
              <p><strong>Punishment:</strong> {currentRent.punishment}</p>
              <p><strong>Is Paid:</strong> {currentRent.isPaid ? 'Yes' : 'No'}</p>

            </div>
            <div className="flex justify-center mt-4">
              <button onClick={closeModals} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
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

export default RentCollectionPage;