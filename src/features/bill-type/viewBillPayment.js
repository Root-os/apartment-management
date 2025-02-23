import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table'; // Import the TableComponent
import Modal from '../../components/Modal';

const BillTablePage = () => {
  const [billData, setBillData] = useState([]); // To store fetched bill data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle error state
  const [selectedBill, setSelectedBill] = useState(null); // To store the selected bill for editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // To control edit modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // To control delete modal visibility
  const [newTypeName, setNewTypeName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [billToDelete, setBillToDelete] = useState(null); // To store the bill to be deleted

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Define columns for the TableComponent
  const columns = [
    { label: 'Type Name', key: 'typeName' },
    { label: 'Description', key: 'description' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <>
          <button
            onClick={() => handleEdit(row)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/bill-type');
        setBillData(response.data); // Set the fetched data to state
      } catch (err) {
        setError('An error occurred while fetching the bill data.');
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchBillData();
  }, []); // Empty dependency array makes this run only once on component mount

  // Open Modal for Editing
  const handleEdit = (bill) => {
    setSelectedBill(bill);
    setNewTypeName(bill.typeName);
    setNewDescription(bill.description);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (bill) => {
    setBillToDelete(bill);
    setIsDeleteModalOpen(true);
  };

  // Handle delete request
  const handleDelete = async () => {
    try {
      await axios.delete(`https://apartment.houseethiopia.com/api/bill-type/${billToDelete.id}`);
      setBillData(billData.filter((bill) => bill.id !== billToDelete.id));
      setIsDeleteModalOpen(false);
      setBillToDelete(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Bill deleted successfully');
    } catch  {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete the bill.');
    }
  };

  // Handle update request
  const handleUpdate = async () => {
    try {
      const updatedBill = {
        typeName: newTypeName,
        description: newDescription,
      };

      const response = await axios.put(`https://apartment.houseethiopia.com/api/bill-type/${selectedBill.id}`, updatedBill);

      const updatedData = billData.map((bill) =>
        bill.id === selectedBill.id ? response.data : bill
      );
      setBillData(updatedData);
      setIsEditModalOpen(false);
      setSelectedBill(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Bill updated successfully');
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update the bill.');
    }
  };

  const handleAddClick = () => {window.location.href = '/bill-type-view';};

  return (
    <div className="p-6">
      {/* Loading State */}
      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <TableComponent
          title="Bill Payment Types"
          data={billData}
          columns={columns}
          onAdd={handleAddClick} // Pass the onAdd function to TableComponent
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">{selectedBill ? 'Edit Bill' : 'Add Bill'}</h2>
            <div className="mb-4">
              <label htmlFor="typeName" className="block text-sm font-medium text-white-700">
                Type Name
              </label>
              <input
                type="text"
                id="typeName"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-white-700">
                Description
              </label>
              <textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this bill?</h2>
            <div className="flex justify-between">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
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

export default BillTablePage;