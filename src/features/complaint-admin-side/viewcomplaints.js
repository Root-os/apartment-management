import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [complaintToAssign, setComplaintToAssign] = useState(null);
  const [complaintToUpdateStatus, setComplaintToUpdateStatus] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch complaints data when the component mounts
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token'); // Get admin token from localStorage
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}complaints/all`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });
        setComplaints(response.data);
      } catch (error) {
        setError('There was an error fetching the complaints data!');
        console.error('There was an error fetching the complaints data!', error);
      }
    };

    // Fetch employees data when the component mounts
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token'); // Get admin token from localStorage
        const response = await axios.get('https://apartment.houseethiopia.com/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });
        setEmployees(response.data.users); // Assuming the response contains a 'users' array
      } catch (error) {
        setError('There was an error fetching the employees data!');
        console.error('There was an error fetching the employees data!', error);
      }
    };

    fetchComplaints();
    fetchEmployees();
  }, []);

  // Handle delete button click
  const handleDeleteClick = (complaint) => {
    setComplaintToDelete(complaint);
    setIsDeleteModalOpen(true);
  };

  // Handle delete request
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token'); // Get admin token from localStorage
      await axios.delete(`${process.env.REACT_APP_BASE_URL}complaints/delete/${complaintToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      setComplaints((prevComplaints) => prevComplaints.filter((complaint) => complaint.id !== complaintToDelete.id));
      setIsDeleteModalOpen(false);
      setComplaintToDelete(null);
    } catch (error) {
      setError('There was an error deleting the complaint!');
      console.error('There was an error deleting the complaint!', error);
    }
  };

  // Handle assign button click
  const handleAssignClick = (complaint) => {
    setComplaintToAssign(complaint);
    setIsAssignModalOpen(true);
  };

  // Handle assign request
  const handleAssign = async () => {
    try {
      const token = localStorage.getItem('token'); // Get admin token from localStorage
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}complaints/assign`, {
        complaintId: complaintToAssign.id,
        employeeId: employeeId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      setComplaints((prevComplaints) => prevComplaints.map((complaint) =>
        complaint.id === complaintToAssign.id ? response.data.complaint : complaint
      ));
      setIsAssignModalOpen(false);
      setComplaintToAssign(null);
      setEmployeeId('');
    } catch (error) {
      setError('There was an error assigning the complaint!');
      console.error('There was an error assigning the complaint!', error);
    }
  };

  // Handle update status button click
  const handleUpdateStatusClick = (complaint) => {
    setComplaintToUpdateStatus(complaint);
    setIsUpdateStatusModalOpen(true);
  };

  // Handle update status request
  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem('token'); // Get admin token from localStorage
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}complaints/update-status`, {
        complaintId: complaintToUpdateStatus.id,
        status: status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      setComplaints((prevComplaints) => prevComplaints.map((complaint) =>
        complaint.id === complaintToUpdateStatus.id ? response.data.complaint : complaint
      ));
      setIsUpdateStatusModalOpen(false);
      setComplaintToUpdateStatus(null);
      setStatus('');
    } catch (error) {
      setError('There was an error updating the complaint status!');
      console.error('There was an error updating the complaint status!', error);
    }
  };

  const getEmployeeNameById = (id) => {
    const employee = employees.find((emp) => emp.id === id);
    return employee ? employee.fname : 'Unassigned';
  };

  // Columns for the TableComponent
  const columns = [
    // { label: 'ID', key: 'id' },
    { label: 'Assigned Employee', key: 'assignedEmployeeId', render: (row) => getEmployeeNameById(row.assignedEmployeeId) },
    { label: 'Complain Description', key: 'description' },
    { label: 'Urgency', key: 'urgency' },
    { label: 'Status', key: 'status' },
    { label: 'Tenant Feedback', key: 'tenantFeedback' },
    { label: 'Images', key: 'images', render: (row) => renderImages(row.images) },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className='flex space-x-1'>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white py-1 px-4 rounded mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => handleAssignClick(row)}
            className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
          >
            Assign
          </button>
          <button
            onClick={() => handleUpdateStatusClick(row)}
            className="bg-green-400 text-white py-1 px-2 rounded"
          >
           Status
          </button>
        </div>
      ),
    },
  ];

  // Render images properly (since images are stored as a JSON string)
  const renderImages = (images) => {
    try {
      const imageArray = JSON.parse(images);
      return imageArray.map((image, index) => (
        <img key={index} src={`https://apartment.houseethiopia.com/${image}`} alt={`Complaint Image ${index + 1}`} className="w-16 h-16 object-cover" />
      ));
    } catch (error) {
      return 'No images available';
    }
  };

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <TableComponent
        title="Complaints List"
        data={complaints}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      />

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-300 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4 ">Are you sure you want to delete this complaint?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Assign Complaint to Staff</h2>
            <div className="mb-4">
              <label htmlFor="employeeId" className="block text-sm font-medium text-white-700">Select Employee</label>
              <select
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select an Employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fname}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsAssignModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAssign} className="bg-blue-500 text-white px-4 py-2 rounded">Assign</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isUpdateStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-200 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Update Complaint Status</h2>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-white-700">Select Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsUpdateStatusModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleUpdateStatus} className="bg-blue-500 text-white px-4 py-2 rounded">update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;