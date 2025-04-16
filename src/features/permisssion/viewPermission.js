import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal'; 

const PermissionsPage = () => {
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', name: '' });
  const [deletePermissionId, setDeletePermissionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // success | error | warning
  const [searchTerm, setSearchTerm] = useState(''); // for search functionality
  const [permissionDetails, setPermissionDetails] = useState(null); // for details view

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchPermissions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}permissions`, { headers });
      setPermissions(res.data);
      setFilteredPermissions(res.data); 
    } catch (err) {
      setModalType('error');
      setModalMessage(err.response?.data?.message || 'Failed to fetch permissions.');
      setModalOpen(true);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const openEditModal = (permission) => {
    setEditForm({ id: permission.id, name: permission.name });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeletePermissionId(id);
    setIsDeleteModalOpen(true);
  };

  const openDetailsModal = (permission) => {
    setPermissionDetails(permission);
  };

  const submitEdit = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}permissions/${editForm.id}`,
        { name: editForm.name },
        { headers }
      );
      setModalType('success');
      setModalMessage('Permission updated successfully!');
      setIsEditModalOpen(false);
      fetchPermissions();
    } catch (err) {
      setModalType('error');
      setModalMessage(err.response?.data?.message || 'Failed to update permission.');
    } finally {
      setIsLoading(false);
      setModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}permissions/${deletePermissionId}`, {
        headers,
      });
      setModalType('success');
      setModalMessage('Permission deleted successfully!');
      fetchPermissions();
    } catch (err) {
      setModalType('error');
      setModalMessage(err.response?.data?.message || 'Failed to delete permission.');
    } finally {
      setIsDeleteModalOpen(false);
      setModalOpen(true);
    }
  };

  // Filter permissions based on search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredPermissions(permissions); // Show all permissions when search is cleared
    } else {
      setFilteredPermissions(
        permissions.filter((permission) =>
          permission.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Permissions</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Permissions"
          value={searchTerm}
          onChange={handleSearch}
          className="bg-base-100 w-full p-2 border rounded"
        />
      </div>

      {/* Display Permissions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPermissions.map((permission) => (
          <div
            key={permission.id}
            className="bg-base-100 p-4 shadow-md rounded-md border flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{permission.name}</h2>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => openEditModal(permission)}
              >
                Edit
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => openDeleteModal(permission.id)}
              >
                Delete
              </button>
              <button
                className="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-600"
                onClick={() => openDetailsModal(permission)}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Details Modal */}
      {permissionDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-scroll">
            <h2 className="text-xl font-bold mb-4">Permission Details</h2>
            <p><strong>Name:</strong> {permissionDetails.name}</p>
            <div>
              <h3 className="mt-4 text-lg font-semibold">Assigned Roles</h3>
              <ul>
                {permissionDetails.Roles.length > 0 ? (
                  permissionDetails.Roles.map((role) => (
                    <li key={role.id}>
                      <span>{role.name}</span>
                    </li>
                  ))
                ) : (
                  <p>No roles assigned.</p>
                )}
              </ul>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setPermissionDetails(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-1/3 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Permission</h2>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Permission Name"
              className="bg-white w-full p-2 mb-4 border rounded"
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
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this permission?
            </h2>
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

      {/* Success/Error Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={modalType}
        message={modalMessage}
      />
    </div>
  );
};

export default PermissionsPage;
