import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const token = localStorage.getItem('token');

const UserAll = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMessageType, setModalMessageType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data.users);
      } catch (err) {
        setError('An error occurred while fetching the users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}auth/delete/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setModalMessageType('success');
      setModalMessage('User deleted successfully');
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setModalMessageType('error');
      setModalMessage(err.response?.data?.message || 'An error occurred while deleting the user.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    { key: 'fname', label: 'First Name' },
    { key: 'lname', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', render: (user) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleDeleteClick(user)}
            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6">User Management</h1>
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 border border-red-400 rounded-md">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center">
          <p>Loading.</p>
        </div>
      ) : (
        <TableComponent
          title="Users"
          data={users}
          columns={columns}
          rowsPerPageOptions={[5, 10, 15]}
          showSearch={true}
          exportable={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        messageType="warning"
        message="Are you sure you want to delete this user?"
        actions={[
          {
            label: "Cancel",
            onClick: () => setIsDeleteModalOpen(false),
            className: "bg-gray-400 text-white px-4 py-2 rounded"
          },
          {
            label: "Delete",
            onClick: handleDelete,
            className: "bg-red-500 text-white px-4 py-2 rounded"
          }
        ]}
      />

      {/* Success/Error Modal */}
      <Modal
        isOpen={modalMessage !== ''}
        onClose={() => setModalMessage('')}
        messageType={modalMessageType === 'success' ? 'success' : 'error'}
        message={modalMessage}
        actions={[
          {
            label: "Close",
            onClick: () => setModalMessage(''),
            className: "bg-blue-500 text-white px-4 py-2 rounded"
          }
        ]}
      />
    </div>
  );
};

export default UserAll;