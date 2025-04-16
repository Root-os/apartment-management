import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom'; // For redirecting to login

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]); // To hold filtered roles
  const [editRoleId, setEditRoleId] = useState(null);
  const [editName, setEditName] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success' | 'error' | 'warning'

  const [searchTerm, setSearchTerm] = useState(''); // for search functionality

  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // For redirecting

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const showModal = (type, message) => {
    setModalType(type);
    setModalMessage(message);
    setModalOpen(true);
  };

  const fetchRoles = async () => {
    // Validate token presence
    if (!token) {
      showModal('error', 'You are not authenticated. Please log in.');
      navigate('/login'); // Redirect to login page
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data);
      setFilteredRoles(response.data); // Initially, display all roles
    } catch (error) {
      console.error('Error fetching roles:', error);

      // Check if the error is due to 401 Unauthorized
      if (error.response && error.response.status === 401) {
        showModal('error', 'Session expired or unauthorized access. Please log in again.');
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login'); // Redirect to login
      } else {
        showModal('error', 'Failed to fetch roles. Please try again later.');
      }
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id) => {
    if (!token) {
      showModal('error', 'You are not authenticated. Please log in.');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}roles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showModal('success', 'Role deleted successfully.');
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      if (error.response && error.response.status === 401) {
        showModal('error', 'Session expired or unauthorized access. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        showModal('error', 'Failed to delete role.');
      }
    }
  };

  const handleEdit = (id, name) => {
    setEditRoleId(id);
    setEditName(name);
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) {
      return showModal('warning', 'Role name cannot be empty.');
    }

    if (!token) {
      showModal('error', 'You are not authenticated. Please log in.');
      navigate('/login');
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}roles/${id}`,
        { name: editName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showModal('success', 'Role updated successfully.');
      setEditRoleId(null);
      setEditName('');
      fetchRoles();
    } catch (error) {
      console.error('Error updating role:', error);
      if (error.response && error.response.status === 401) {
        showModal('error', 'Session expired or unauthorized access. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const errMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to update role.';
        showModal('error', errMsg);
      }
    }
  };

  // Filter roles based on search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredRoles(roles); // Show all roles when search is cleared
    } else {
      setFilteredRoles(
        roles.filter((role) =>
          role.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Roles</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Roles"
          value={searchTerm}
          onChange={handleSearch}
          className="bg-base-100 w-full p-2 border rounded"
        />
      </div>

      {/* Display Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((role) => (
          <div
            key={role.id}
            className="bg-base-100 shadow-lg rounded-lg p-4 border-2 border-gray-600" 
          >
            {editRoleId === role.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border border-gray-300 rounded w-full px-2 py-1 mb-2"
              />
            ) : (
              <h2 className="text-lg font-semibold capitalize">{role.name}</h2>
            )}

            <div className="flex justify-end space-x-2">
              {editRoleId === role.id ? (
                <button
                  onClick={() => handleSaveEdit(role.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(role.id, role.name)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => handleDelete(role.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for success/error */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        messageType={modalType}
        message={modalMessage}
      />
    </div>
  );
};

export default RolesPage;
