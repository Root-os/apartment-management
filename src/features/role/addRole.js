import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal'; 
import TitleCard from '../../components/Cards/TitleCard';

const AddRolePage = () => {
  const [roleName, setRoleName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success' | 'error'

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddRole = async (e) => {
    e.preventDefault();

    if (!roleName.trim()) {
      setModalType('warning');
      setModalMessage('Role name cannot be empty.');
      setModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}roles`, {
        name: roleName.trim(),
      });

      setModalType('success');
      setModalMessage(`Role "${response.data.name}" added successfully!`);
      setModalOpen(true);
      setRoleName('');
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'An error occurred while adding the role.';
      setModalType('error');
      setModalMessage(errMsg);
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div >
     <TitleCard title="Add New Role" topMargin="mt-1" >
      <form onSubmit={handleAddRole}>
        <label htmlFor="roleName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Role Name
        </label>
        <input
          type="text"
          id="roleName"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="bg-base-100 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter role name"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 w-full py-2 px-4 text-white rounded-md transition-all ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Adding...' : 'Add Role'}
        </button>
      </form>
     </TitleCard>
      {/* Modal Component */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        messageType={modalType}
        message={modalMessage}
      />
    </div>
  );
};

export default AddRolePage;
