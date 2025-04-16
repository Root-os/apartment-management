import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal'; 
import TitleCard from '../../components/Cards/TitleCard';

const AssignPermissionsPage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  const token = localStorage.getItem('token');

  const handleCloseModal = () => setModalOpen(false);

  const fetchRolesAndPermissions = async () => {
    if (!token) {
      setModalType('error');
      setModalMessage('Authentication token not found.');
      setModalOpen(true);
      return;
    }

    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BASE_URL}roles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_BASE_URL}permissions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setRoles(rolesRes.data);
      setPermissions(permissionsRes.data);
    } catch (err) {
      setModalType('error');
      setModalMessage('Failed to load roles or permissions.');
      setModalOpen(true);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const handleAssignPermissions = async (e) => {
    e.preventDefault();

    if (!selectedRoleId || selectedPermissionIds.length === 0) {
      setModalType('warning');
      setModalMessage('Please select a role and at least one permission.');
      setModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}permissions/assign`,
        {
          roleId: Number(selectedRoleId),
          permissionIds: selectedPermissionIds.map((id) => Number(id)),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModalType('success');
      setModalMessage(response.data.message || 'Permissions assigned successfully!');
      setModalOpen(true);
      setSelectedRoleId('');
      setSelectedPermissionIds([]);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'An error occurred while assigning permissions.';
      setModalType('error');
      setModalMessage(errMsg);
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <TitleCard title="Assign Permissions" topMargin="mt-1" >

            {fetchingData ? (
            <p className="text-gray-600 dark:text-gray-300">Loading roles and permissions...</p>
            ) : (
            <form onSubmit={handleAssignPermissions}>
                {/* Role Dropdown */}
                <div className="mb-4">
                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Select Role
                </label>
                <select
                    id="role"
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-base-100 dark:text-white"
                >
                    <option value="">-- Select Role --</option>
                    {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                        {role.name}
                    </option>
                    ))}
                </select>
                </div>

                {/* Permissions Multi-select */}
                <div className="mb-4">
                <label htmlFor="permissions" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Select Permissions
                </label>
                <select
                    id="permissions"
                    multiple
                    value={selectedPermissionIds}
                    onChange={(e) =>
                    setSelectedPermissionIds(
                        Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                    }
                    className="w-full h-40 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-base-100 dark:text-white"
                >
                    {permissions.map((permission) => (
                    <option key={permission.id} value={permission.id}>
                        {permission.name}
                    </option>
                    ))}
                </select>
                <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Hold Ctrl (Cmd on Mac) to select multiple</p>
                </div>

                {/* Submit Button */}
                <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 text-white rounded-md transition-all ${
                    isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                >
                {isLoading ? 'Assigning...' : 'Assign Permissions'}
                </button>
            </form>
            )}
       </TitleCard>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        messageType={modalType}
        message={modalMessage}
      />
    </div>
  );
};

export default AssignPermissionsPage;
