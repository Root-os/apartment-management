import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table'; // Import the TableComponent
import Modal from 'react-modal';

const BillTablePage = () => {
  const [billData, setBillData] = useState([]); // To store fetched bill data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle error state
  const [selectedBill, setSelectedBill] = useState(null); // To store the selected bill for editing
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [newTypeName, setNewTypeName] = useState('');
  const [newDescription, setNewDescription] = useState('');

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
            onClick={() => handleDelete(row.id)}
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
    setShowModal(true);
  };

  // Handle delete request
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await axios.delete(`https://apartment.houseethiopia.com/api/bill-type/${id}`);
        setBillData(billData.filter((bill) => bill.id !== id));
      } catch (err) {
        setError('An error occurred while deleting the bill.');
      }
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
      setShowModal(false);
      setSelectedBill(null);
    } catch (err) {
      setError('An error occurred while updating the bill.');
    }
  };

  // Handle adding a new bill
  const handleAdd = () => {
    setShowModal(true); // Open modal for adding a new bill
    setSelectedBill(null); // Clear selected bill
    setNewTypeName('');
    setNewDescription('');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Bill Payment Types</h1>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 border border-red-400 rounded-md">
          {error}
        </div>
      )}

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
          onAdd={handleAdd} // Pass the onAdd function to TableComponent
        />
      )}

      {/* Edit Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Edit Bill Payment"
          className="fixed inset-0 bg-base-100 bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-base-100 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">{selectedBill ? 'Edit Bill' : 'Add Bill'}</h2>
            <div className="mb-4">
              <label htmlFor="typeName" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
                onClick={() => setShowModal(false)}
                className="bg-base-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BillTablePage;