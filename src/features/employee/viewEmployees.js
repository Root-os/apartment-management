import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import LoadingComponent from "../../components/loading";
import Modal from "../../components/Modal"; // Modal to display success/error messages
import { CalendarContext } from "../../context/calendarContext";
import api from '../../utils/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]); // New state for roles
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editEmployeeData, setEditEmployeeData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    salary: "",
    position: "",
    hireDate: "",
    shift: "",
    employmentType: "",
    emergencyContact: "",
    address: "",
    bankAccount: "",
    roleId: "", // Add roleId to the state
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const {formatDateForDisplay} = useContext(CalendarContext);
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token is missing in localStorage.");
        setLoading(false);
        return;
      }

      try {
        // Fetch employees
        const employeeResponse = await api.get(
          `auth/employee`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployees(employeeResponse.data.users);

        // Fetch roles
        const rolesResponse = await api.get(
          `roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRoles(rolesResponse.data);
      } catch (err) {
        setError("Failed to fetch data: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEditEmployeeData({
      fname: employee.fname,
      lname: employee.lname,
      phone: employee.phone,
      email: employee.email,
      salary: employee.EmployeeDetail?.salary || "",
      position: employee.EmployeeDetail?.position || "",
      // department: employee.EmployeeDetail?.department || "",
      hireDate: employee.EmployeeDetail?.hireDate ? new Date(employee.EmployeeDetail.hireDate).toISOString().split('T')[0] : "",
      shift: employee.EmployeeDetail?.shift || "",
      employmentType: employee.EmployeeDetail?.employmentType || "",
      emergencyContact: employee.EmployeeDetail?.emergencyContact || "",
      address: employee.EmployeeDetail?.address || "",
      bankAccount: employee.EmployeeDetail?.bankAccount || "",
      roleId: employee.roleId?.toString() || "", // Initialize roleId
      password: "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await api.delete(
        `auth/delete/${selectedEmployee.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
      setModalOpen(true);
      setMessageType('success');
      setMessage(response.data.message || "User deleted successfully");
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage(err.response?.data?.message || "Failed to delete employee.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    const token = localStorage.getItem("token");
    setBtnLoading(true);
    try {
      const response = await api.put(
        `auth/update-employee/${selectedEmployee.id}`,
        {
          ...editEmployeeData,
          roleId: parseInt(editEmployeeData.roleId), // Ensure roleId is sent as a number
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedEmployee = {
        ...response.data.user,
        EmployeeDetail: response.data.employeeDetail,
        Role: roles.find((role) => role.id === parseInt(editEmployeeData.roleId)) || {
          name: "N/A",
        }, // Map the new role name
      };
      
      const updatedEmployees = employees.map((emp) =>
        emp.id === selectedEmployee.id ? updatedEmployee : emp
      );

      setEmployees(updatedEmployees);
      setIsEditModalOpen(false);
      setModalOpen(true);
      setMessageType("success");
      setMessage(response.data.message || "Employee updated successfully");
    } catch (err) {
      setModalOpen(true);
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to update employee.");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleAdd = () => {
    window.location.href = '/app/add-employee';
  };

  const columns = [
    { key: "fname", label: "First Name" },
    { key: "lname", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (user) => user.Role?.name || 'N/A' },
    { key: "status", label: "Status" },
    {
      key: "action",
      label: "Action",
      render: (employee) => (
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 text-sm bg-gray-400 text-white rounded"
            onClick={() => handleViewDetails(employee)}
          >
            Detail
          </button>
          <button
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded"
            onClick={() => handleEditEmployee(employee)}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 text-sm bg-red-500 text-white rounded"
            onClick={() => handleDeleteClick(employee)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <TableComponent
        title="Employee List"
        data={employees}
        columns={columns}
        exportable={true}
        showSearch={true}
        onAdd={handleAdd}
      />

      {/* Detail Modal */}
      {isDetailModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
            <p><strong>First Name:</strong> {selectedEmployee.fname}</p>
            <p><strong>Last Name:</strong> {selectedEmployee.lname}</p>
            <p><strong>Email:</strong> {selectedEmployee.email}</p>
            <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
            <p><strong>Position:</strong> {selectedEmployee.EmployeeDetail?.position || 'N/A'}</p>
            <p><strong>Salary:</strong> {selectedEmployee.EmployeeDetail?.salary || 'N/A'}</p>
            {/* <p><strong>Department:</strong> {selectedEmployee.EmployeeDetail?.department || 'N/A'}</p> */}
            <p><strong>Role:</strong> {selectedEmployee.Role?.name || 'N/A'}</p>
            <p><strong>Work Shift:</strong> {selectedEmployee.EmployeeDetail?.shift || 'N/A'}</p>
            <p><strong>Address:</strong> {selectedEmployee.EmployeeDetail?.address || 'N/A'}</p>
            <p><strong>Hire Date:</strong> {formatDateForDisplay(selectedEmployee.EmployeeDetail?.hireDate) ?? '-'}</p>
            <p><strong>Employment Type:</strong>{selectedEmployee.EmployeeDetail?.employeementType || 'N/A'}</p>
            <p><strong>Bank Account:</strong>{selectedEmployee.EmployeeDetail?.bankAccount || 'N/A'}</p>
            <p><strong>Emergency Contact</strong>{selectedEmployee.EmployeeDetail?.emergencyContact || 'N/A'}</p>

            <div className="mt-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
            <form>
              <div className="mb-2">
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-100 rounded mt-1"
                  value={editEmployeeData.fname}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, fname: e.target.value })}
                  placeholder="First Name"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-100 rounded mt-1"
                  value={editEmployeeData.lname}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, lname: e.target.value })}
                  placeholder="Last Name"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-100 rounded mt-1"
                  value={editEmployeeData.phone}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, phone: e.target.value })}
                  placeholder="Phone"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-100 rounded mt-1"
                  value={editEmployeeData.email}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, email: e.target.value })}
                  placeholder="Email"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">Salary</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-100 rounded mt-1"
                  value={editEmployeeData.salary}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, salary: e.target.value })}
                  onWheel={(e) => e.target.blur()}
                  placeholder="Salary"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">Position</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-100 rounded mt-1"
                  value={editEmployeeData.position}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, position: e.target.value })}
                  placeholder="Position"
                />
              </div>
{/* 
              <div className="mb-2">
                <label className="block text-sm font-medium">Department</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-100 rounded mt-1"
                  value={editEmployeeData.department}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, department: e.target.value })}
                  placeholder="Department"
                />
              </div> */}

              <div className="mb-2">
                <label className="block text-sm font-medium">Hire Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-100 rounded mt-1"
                  value={editEmployeeData.hireDate}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, hireDate: e.target.value })}
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">Work Shift</label>
                <select
                  className="w-full p-2 border border-gray-100 rounded mt-1"
                  value={editEmployeeData.shift}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, shift: e.target.value })}
                >
                  <option value="day">Day</option>
                  <option value="night">Night</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">Employment Type</label>
                <select
                  className="w-full p-2 border border-gray-100 rounded mt-1"
                  value={editEmployeeData.employmentType}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, employmentType: e.target.value })}
                >
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-100 rounded mt-1"
                  value={editEmployeeData.address}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, address: e.target.value })}
                  placeholder="Address"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Role</label>
                <select
                  className="w-full p-2 border border-gray-100 rounded mt-1"
                  value={editEmployeeData.roleId}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, roleId: e.target.value })}
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2 flex items-center">
  <input
    type="checkbox"
    id="changePassword"
    checked={changePassword}
    onChange={(e) => setChangePassword(e.target.checked)}
    className="mr-2"
  />
  <label htmlFor="changePassword" className="text-sm font-medium">Change Password</label>
</div>
{changePassword && (
  <div className="mb-2">
    <label className="block text-sm font-medium">New Password</label>
    <input
      type="password"
      className="w-full p-2 border border-gray-100 rounded mt-1"
      value={editEmployeeData.password}
      onChange={(e) => setEditEmployeeData({ ...editEmployeeData, password: e.target.value })}
      placeholder="Enter new password"
    />
  </div>
)}

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleEditSubmit}
                  disabled={btnLoading}
                >
                  {btnLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">
              Are you sure you want to delete {selectedEmployee.fname} {selectedEmployee.lname}?
            </h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Message Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default EmployeeList;