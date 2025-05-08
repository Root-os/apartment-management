import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';
import TitleCard from '../../components/Cards/TitleCard';

const RevokePermissionsPage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [fullPermissions, setFullPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [assignedPermissionIds, setAssignedPermissionIds] = useState([]);
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
      setFullPermissions(permissionsRes.data);
      setPermissions(
        permissionsRes.data.map((perm) => ({
          id: perm.id,
          name: perm.name,
        }))
      );
    } catch (error) {
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

  useEffect(() => {
    if (!selectedRoleId) {
      setAssignedPermissionIds([]);
      return;
    }

    const assigned = fullPermissions
      .filter((perm) =>
        perm.Roles?.some((role) => role.id.toString() === selectedRoleId)
      )
      .map((perm) => perm.id.toString());

    setAssignedPermissionIds(assigned);
    setSelectedPermissionIds([]); // clear selection when role changes
  }, [selectedRoleId, fullPermissions]);

  const togglePermission = (id) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleRevokePermissions = async (e) => {
    e.preventDefault();

    const selectedRole = roles.find((r) => r.id.toString() === selectedRoleId);

    if (!selectedRoleId || selectedPermissionIds.length === 0) {
      setModalType('warning');
      setModalMessage('Please select a role and at least one permission to revoke.');
      setModalOpen(true);
      return;
    }

    if (selectedRole?.name?.toLowerCase() === 'admin') {
      setModalType('error');
      setModalMessage('Revoking permissions from the Admin role is not allowed.');
      setModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}permissions/revoke-permissions`,
        {
          roleId: Number(selectedRoleId),
          permissionIds: selectedPermissionIds.map((id) => Number(id)),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setModalType('success');
      setModalMessage(response.data.message || 'Selected permissions revoked successfully.');
      setModalOpen(true);
      setSelectedPermissionIds([]);
      fetchRolesAndPermissions(); // refresh permission data
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'An error occurred while revoking permissions.';
      setModalType('error');
      setModalMessage(errMsg);
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <TitleCard title="Revoke Permissions" topMargin="mt-1">
        {fetchingData ? (
          <p className="text-gray-600 dark:text-gray-300">Loading roles and permissions...</p>
        ) : (
          <form onSubmit={handleRevokePermissions}>
            {/* Role Selector */}
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

            {/* Permission Buttons */}
            {assignedPermissionIds.length > 0 ? (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Assigned Permissions (Click to select for revocation)
                </label>
                <div className="flex flex-wrap gap-2">
                  {permissions
                    .filter((perm) => assignedPermissionIds.includes(perm.id.toString()))
                    .map((perm) => {
                      const isSelected = selectedPermissionIds.includes(perm.id.toString());
                      return (
                        <button
                          type="button"
                          key={perm.id}
                          onClick={() => togglePermission(perm.id.toString())}
                          className={`px-4 py-2 rounded-md text-sm border ${
                            isSelected
                              ? 'bg-red-600 text-white border-red-700'
                              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
                          } hover:shadow`}
                        >
                          {perm.name}
                        </button>
                      );
                    })}
                </div>
              </div>
            ) : (
              selectedRoleId && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  This role has no permissions assigned.
                </p>
              )
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 text-white rounded-md transition-all ${
                isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading ? 'Revoking...' : 'Revoke Selected Permissions'}
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

export default RevokePermissionsPage;
