import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/card';
import LoadingComponent from '../../components/loading';
import Modal from '../../components/Modal';

const PaymentTypesPage = () => {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [filteredPaymentTypes, setFilteredPaymentTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPaymentTypes();
  }, []);

  useEffect(() => {
    const filtered = paymentTypes.filter(paymentType =>
      paymentType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paymentType.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPaymentTypes(filtered);
  }, [searchTerm, paymentTypes]);

  const fetchPaymentTypes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}payment-types`);
      setPaymentTypes(response.data);
      setFilteredPaymentTypes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch payment types');
      setLoading(false);
    } 
  };

  const handleEdit = (paymentType) => {
    setSelectedPaymentType(paymentType);
    setEditForm({ name: paymentType.name, description: paymentType.description });
    setIsEditModalOpen(true);
  };

  const handleDelete = (paymentType) => {
    setSelectedPaymentType(paymentType);
    setIsDeleteModalOpen(true);
  };

  const submitEdit = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}payment-types/${selectedPaymentType.id}`,
        editForm
      );
      setIsEditModalOpen(false);
      setModalOpen(true);
      setMessageType('success');
      setMessage("Payment request type updated successfully!");
      fetchPaymentTypes(); // Refresh data
    } catch (err) {
      setError('Failed to update payment type');
      setModalOpen(true);
      setMessageType('error');
      setMessage("An error occurred while updating the payment type.");
    }finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}payment-types/${selectedPaymentType.id}`
      );
      setIsDeleteModalOpen(false);
      setModalOpen(true);
      setMessageType('success');
      setMessage("Payment request type deleted successfully!");
      fetchPaymentTypes(); // Refresh data
    } catch (err) {
      
      setModalOpen(true);
      setMessageType('error');
      setMessage('Failed to delete payment type');
    }
  };

  const getActions = (paymentType) => [
    {
      label: 'Edit',
      type: 'primary',
      onClick: () => handleEdit(paymentType)
    },
    {
      label: 'Delete',
      type: 'secondary',
      onClick: () => handleDelete(paymentType)
    }
  ];



  return (
    <div className="container mx-auto p-6">
          {loading ? (<LoadingComponent/>):(
      <>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search payment types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-base-100 w-full max-w-md p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPaymentTypes.map((paymentType) => (
          <Card
            key={paymentType.id}
            title={paymentType.name}
            content={paymentType.description}
            actions={getActions(paymentType)}
          />
        ))}
      </div>
    </>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Payment Type</h2>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Name"
              className="bg-base-100 w-full p-2 mb-4 border rounded"
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Description"
              className="bg-base-100 w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={isLoading}
              >
                {isLoading ? 'saving...':'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            
          <h2 className="text-xl mb-4">Are you sure you want to delete this payment type?</h2>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
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

export default PaymentTypesPage;