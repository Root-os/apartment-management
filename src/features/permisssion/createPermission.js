import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal'; 
import TitleCard from '../../components/Cards/TitleCard';

const AddPermissionPage = () => {
  const [permissionName, setPermissionName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); 

  const handleCloseModal = () => setModalOpen(false);

  const token = localStorage.getItem('token');


  const handleCreatePermission = async (e) => {
    e.preventDefault();

    if (!permissionName.trim()) {
      setModalType('warning');
      setModalMessage('Permission name cannot be empty.');
      setModalOpen(true);
      return;
    }
 
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}permissions`,  {
        name: permissionName.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setModalType('success');
      setModalMessage(`Permission "${response.data.name}" created successfully!`);
      setModalOpen(true);
      setPermissionName('');
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'An error occurred while creating the permission.';
      setModalType('error');
      setModalMessage(errMsg);
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div >
        <TitleCard title="Add New Permission" topMargin="mt-1" >
      <form onSubmit={handleCreatePermission}>
        <label
          htmlFor="permissionName"
          className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Permission Name
        </label>
        <select
          id="permissionName"
          value={permissionName}
          onChange={(e) => setPermissionName(e.target.value)}
          className="bg-base-100 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a permission</option>
          <option value="Building">Finance</option>
          <option value="Tenant">Tenant</option>
          <option value="Employee">Employee</option>
          <option value="Finance">Finance</option>
          <option value="Inventory">Inventory</option>
          <option value="Purchase">Purchase</option>
          <option value="Order">Order</option>
          <option value="Item Assignments">Item Assignments</option>
          <option value="Asset">Asset</option>
          <option value="Utility">Utility</option>
          <option value="Communication">Communication</option>
          <option value="Reports">Reports</option>
          {/* Add more options as needed */}
        </select>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 w-full py-2 px-4 text-white rounded-md transition-all ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Permission'}
        </button>
      </form>
     </TitleCard>
      {/* Modal Integration */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        messageType={modalType}
        message={modalMessage}
      />
    </div>
  );
};

export default AddPermissionPage;
