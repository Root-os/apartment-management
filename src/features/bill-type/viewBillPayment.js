import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/card';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const BillTablePage = () => {
  const [billData, setBillData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [selectedBill, setSelectedBill] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [newTypeName, setNewTypeName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [billToDelete, setBillToDelete] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}bill-type`);
        setBillData(response.data); 
        setFilteredData(response.data); // Set initial filtered data
      } catch (err) {
        setError('An error occurred while fetching the bill data.');
      } finally {
        setLoading(false); 
      }
    };

    fetchBillData();
  }, []); 

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredBills = billData.filter(
      (bill) =>
        bill.typeName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        bill.description.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredData(filteredBills);
  };

  const handleEdit = (bill) => {
    setSelectedBill(bill);
    setNewTypeName(bill.typeName);
    setNewDescription(bill.description);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (bill) => {
    setBillToDelete(bill);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}bill-type/${billToDelete.id}`);
      setBillData(billData.filter((bill) => bill.id !== billToDelete.id));
      setFilteredData(filteredData.filter((bill) => bill.id !== billToDelete.id)); // Update filtered data as well
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
    setIsLoading(true);
    try {
      const updatedBill = {
        typeName: newTypeName,
        description: newDescription,
      };

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}bill-type/${selectedBill.id}`, updatedBill);

      const updatedData = billData.map((bill) =>
        bill.id === selectedBill.id ? response.data : bill
      );
      setBillData(updatedData);
      setFilteredData(updatedData); // Update filtered data
      setIsEditModalOpen(false);
      setSelectedBill(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Bill updated successfully');
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update the bill.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {window.location.href = '/bill-type-add';};

  return (
    <div className="p-6">
      {/* Title and Search Bar */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bill Types</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by Type Name or Description"
          className="mt-4 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((bill) => (
            <Card
              key={bill.id}
              title={bill.typeName}
              content={bill.description}
              actions={[
                {
                  label: 'Edit',
                  onClick: () => handleEdit(bill),
                  type: 'primary',
                },
                {
                  label: 'Delete',
                  onClick: () => handleDeleteClick(bill),
                  type: 'secondary',
                },
              ]}
            />
          ))}
        </div>
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
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
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
            <div className="flex justify-end space-x-1">
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
