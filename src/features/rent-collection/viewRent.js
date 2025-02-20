import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const RentCollectionPage = () => {
  const [rentData, setRentData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentRent, setCurrentRent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Rent Collection Data
  const fetchRentData = async () => {
    try {
      const response = await axios.get('https://apartment.houseethiopia.com/api/rent-collection');
      setRentData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rent data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentData();
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

  // Handle Close Modals
  const closeModals = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
  };

  // Handle Edit Form Submission (PUT Request)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedRent = { ...currentRent };
      const response = await axios.put(`https://apartment.houseethiopia.com/api/rent-collection/${currentRent.id}`, updatedRent);
      fetchRentData(); // Refetch data after updating
      closeModals();
    } catch (error) {
      console.error('Error updating rent data:', error);
    }
  };

  // Handle Rent Deletion (DELETE Request)
  const handleDeleteRent = async () => {
    try {
      await axios.delete(`https://apartment.houseethiopia.com/api/rent-collection/${currentRent}`);
      fetchRentData(); // Refetch data after deletion
      closeModals();
    } catch (error) {
      console.error('Error deleting rent data:', error);
    }
  };

  // Render Table of Rent Data
  const renderRentTable = () => (
    <table className="min-w-full table-auto">
      <thead className="bg-base-100">
        <tr>
          <th className="px-4 py-2">Tenant</th>
          <th className="px-4 py-2">Amount Paid</th>
          <th className="px-4 py-2">Payment Date</th>
          <th className="px-4 py-2">Payment Method</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead >
      <tbody className="bg-base-100">
        {rentData.map((rent) => (
          <tr key={rent.id} className="border-b">
            <td className="px-4 py-2">{rent.Tenant.fullName}</td>
            <td className="px-4 py-2">{rent.amountPaid}</td>
            <td className="px-4 py-2">{new Date(rent.paymentDate).toLocaleDateString()}</td>
            <td className="px-4 py-2">{rent.paymentMethod}</td>
            <td className="px-4 py-2">{rent.status}</td>
            <td className="px-4 py-2">
              <button onClick={() => openEditModal(rent)} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                Edit
              </button>
              <button onClick={() => openDeleteModal(rent.id)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Render Edit Modal
  const renderEditModal = () => (
    <Modal
      isOpen={editModalOpen}
      onRequestClose={closeModals}
      contentLabel="Edit Rent Collection"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-xl font-semibold mb-4">Edit Rent Collection</h2>
      <form onSubmit={handleEditSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
          <input
            type="number"
            value={currentRent?.amountPaid || ''}
            onChange={(e) => setCurrentRent({ ...currentRent, amountPaid: e.target.value })}
            className="px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <input
            type="text"
            value={currentRent?.paymentMethod || ''}
            onChange={(e) => setCurrentRent({ ...currentRent, paymentMethod: e.target.value })}
            className="px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <input
            type="text"
            value={currentRent?.status || ''}
            onChange={(e) => setCurrentRent({ ...currentRent, status: e.target.value })}
            className="px-4 py-2 border rounded"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={closeModals} className="bg-gray-500 text-white py-1 px-4 rounded">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white py-1 px-4 rounded">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );

  // Render Delete Modal
  const renderDeleteModal = () => (
    <Modal
      isOpen={deleteModalOpen}
      onRequestClose={closeModals}
      contentLabel="Confirm Deletion"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this rent collection?</h2>
      <div className="flex justify-end space-x-2">
        <button onClick={closeModals} className="bg-gray-500 text-white py-1 px-4 rounded">
          Cancel
        </button>
        <button onClick={handleDeleteRent} className="bg-red-500 text-white py-1 px-4 rounded">
          Confirm Delete
        </button>
      </div>
    </Modal>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center">Rent Collection Management</h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          renderRentTable()
        )}
      </div>

      {/* Render Modals */}
      {renderEditModal()}
      {renderDeleteModal()}
    </div>
  );
};

export default RentCollectionPage;
