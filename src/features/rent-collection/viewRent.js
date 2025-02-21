import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const RentCollectionPage = () => {
  const [rentData, setRentData] = useState([]);
  const [tenantData, setTenantData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentRent, setCurrentRent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

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
  };

  // Handle Edit Form Submission (PUT Request)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedRent = { ...currentRent };
      await axios.put(`${process.env.REACT_APP_BASE_URL}rent-collection/${currentRent.id}`, updatedRent);
      fetchRentData(); // Refetch data after updating
      closeModals();
      setModalMessage('Rent updated successfully!');
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error updating rent data:', error);
      setModalMessage('Error updating rent. Please try again.');
      setIsErrorModalOpen(true);
    }
  };

  // Handle Rent Deletion (DELETE Request)
  const handleDeleteRent = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}rent-collection/${currentRent}`);
      fetchRentData();
      closeModals();
      setModalMessage('Rent deleted successfully!');
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error deleting rent data:', error);
      setModalMessage('Error deleting rent. Please try again.');
      setIsErrorModalOpen(true);
    }
  };

  const columns = [
    { key: 'tenantName', label: 'Tenant Name', render: (rent) => rent.Tenant.fullName },
    { key: 'amountPaid', label: 'Amount Paid' },
    { key: 'paymentDate', label: 'Payment Date', render: (rent) => new Date(rent.paymentDate).toLocaleDateString() },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (rent) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openEditModal(rent)}
            className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => openDeleteModal(rent.id)}
            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => openDetailsModal(rent)}
            className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-700"
          >
            Details
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8">
      <TableComponent
        title="Rent Collection"
        data={rentData}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      />

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
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
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Payment">Mobile Payment</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Payment Frequency</label>
                <select
                  value={currentRent?.paymentFrequency || ''}
                  onChange={(e) => setCurrentRent({ ...currentRent, paymentFrequency: e.target.value })}
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                >
                  <option value="by day">By Day</option>
                  <option value="by week">By Week</option>
                  <option value="by month">By Month</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={currentRent?.status || ''}
                  onChange={(e) => setCurrentRent({ ...currentRent, status: e.target.value })}
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex justify-between">
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
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Are you sure you want to delete this rent collection?</h2>
            <div className="flex justify-between">
              <button onClick={closeModals} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDeleteRent} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailsModalOpen && currentRent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl mb-4">Details for {currentRent.Tenant.fullName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong>Tenant Name:</strong> {currentRent.Tenant.fullName}</p>
              <p><strong>Phone Number:</strong> {currentRent.Tenant.phoneNumber}</p>
              <p><strong>Unit Number:</strong> {currentRent.Tenant.Unit.unitNumber}</p>
              <p><strong>Floor Number:</strong> {currentRent.Tenant.Floor.floorNumber}</p>
              <p><strong>Paid Days:</strong> {currentRent.paidDays}</p>
              <p><strong>Next Due Date:</strong> {new Date(currentRent.nextDueDate).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-center mt-4">
              <button onClick={closeModals} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
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

export default RentCollectionPage;