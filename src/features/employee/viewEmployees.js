import React, { useEffect, useState } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import LoadingComponent from "../../components/loading";
import Modal from "../../components/Modal"; // Modal to display success/error messages

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Modal state for details
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal state for edit
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal state for delete
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editEmployeeData, setEditEmployeeData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    salary: "",
    position: "",
    department: "",
    hireDate: "",
    shift: "",
    employmentType: "",
    emergencyContact: "",
    address: "",
    bankAccount: ""
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false); // Success/Error message modal state
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token is missing in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}auth/employee`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployees(response.data.users);
      } catch (err) {
        setError("Failed to fetch employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
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
      department: employee.EmployeeDetail?.department || "",
      hireDate: employee.EmployeeDetail?.hireDate || "",
      shift: employee.EmployeeDetail?.shift || "",
      employmentType: employee.EmployeeDetail?.employmentType || "",
      emergencyContact: employee.EmployeeDetail?.emergencyContact || "",
      address: employee.EmployeeDetail?.address || "",
      bankAccount: employee.EmployeeDetail?.bankAccount || ""
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
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}auth/delete/${selectedEmployee.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the employees state by removing the deleted employee
      setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));

      // Close the delete modal and show success message
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
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}auth/update-employee/${selectedEmployee.id}`,
        editEmployeeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update employee data in state
      const updatedEmployees = employees.map((emp) => 
        emp.id === selectedEmployee.id ? response.data.user : emp
      );
      setEmployees(updatedEmployees);

      // Close edit modal and show success message
      setIsEditModalOpen(false);
      setModalOpen(true);
      setMessageType('success');
      setMessage(response.data.message || "Employee updated successfully");
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage(err.response?.data?.message || "Failed to update employee.");
    } finally
     {
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
    { key: "phone", label: "Phone" },
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
            <p><strong>Department:</strong> {selectedEmployee.EmployeeDetail?.department || 'N/A'}</p>
            <p><strong>Role:</strong> {selectedEmployee.Role?.name || 'N/A'}</p>
            <p><strong>Work Shift:</strong> {selectedEmployee.EmployeeDetail?.shift || 'N/A'}</p>
            <p><strong>Address:</strong> {selectedEmployee.EmployeeDetail?.address || 'N/A'}</p>
            <p><strong>Hire Date:</strong> {new Date(selectedEmployee.EmployeeDetail?.hireDate).toLocaleDateString()}</p>
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

        <div className="mb-2">
          <label className="block text-sm font-medium">Department</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-100 rounded mt-1"
            value={editEmployeeData.department}
            onChange={(e) => setEditEmployeeData({ ...editEmployeeData, department: e.target.value })}
            placeholder="Department"
          />
        </div>

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
          <input
            type="text"
            className="w-full p-2 border border-gray-100 rounded mt-1"
            value={editEmployeeData.employmentType}
            onChange={(e) => setEditEmployeeData({ ...editEmployeeData, employmentType: e.target.value })}
            placeholder="Employment Type"
          />
        </div>

        {/* <div className="mb-2">
          <label className="block text-sm font-medium">Emergency Contact</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-100 rounded mt-1"
            value={editEmployeeData.emergencyContact}
            onChange={(e) => setEditEmployeeData({ ...editEmployeeData, emergencyContact: e.target.value })}
            placeholder="Emergency Contact"
          />
        </div> */}

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

        {/* <div className="mb-2">
          <label className="block text-sm font-medium">Bank Account</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-100 rounded mt-1"
            value={editEmployeeData.bankAccount}
            onChange={(e) => setEditEmployeeData({ ...editEmployeeData, bankAccount: e.target.value })}
            placeholder="Bank Account"
          />
        </div> */}

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
            disable={btnLoading}
          >
           {btnLoading ? '':' Save Changes'}
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
