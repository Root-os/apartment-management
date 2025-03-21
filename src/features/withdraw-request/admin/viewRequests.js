import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table';
import Modal from '../../../components/Modal';
import LoadingComponent from '../../../components/loading';

const WithdrawalRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [pageLoading, setPageLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [users, setUsers] = useState([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [requestToUpdate, setRequestToUpdate] = useState(null);
  const [requestToAssign, setRequestToAssign] = useState(null);
  const [requestToFinalize, setRequestToFinalize] = useState(null);
  const [status, setStatus] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [depositRefundStatus, setDepositRefundStatus] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);  // State to hold selected request details
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success')
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}withdrawal-request/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTenants(response.data);
      } catch (error) {
        console.error('Error fetching tenants: ', error);
      }
    };

    fetchTenants();
  }, [token]);

  useEffect(() => {
    const fetchusers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchusers();
  }, [token]);

  const getTenantNameById = (id) => {
    const tenant = tenants.find((tenant) => tenant.id === id);
    return tenant ? tenant.fullName : 'Unknown';
  };

  const handleStatusClick = (request) => {
    setRequestToUpdate(request);
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    // Validate the status and adminResponse
    if (!status || !adminResponse) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Status and Admin Response cannot be empty');
      return;
    }
  
    setIsLoading(true);
    try {
      // Sending the request to the backend
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}withdrawal-request/review`, {
        requestId: requestToUpdate.id,
        status: status,
        adminResponse: adminResponse,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // If the response is successful, update the request data
      setData((prevData) => prevData.map((request) =>
        request.id === requestToUpdate.id ? response.data.request : request
      ));
  
      // Reset the modal state
      setIsStatusModalOpen(false);
      setRequestToUpdate(null);
      setStatus('');
      setAdminResponse('');
  
      // Show success message in modal
      setModalOpen(true);
      setMessageType('success');
      setMessage('Updated Successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignClick = (request) => {
    setRequestToAssign(request);
    setIsAssignModalOpen(true);
  };

  const handleAssign = async () => {
    setIsLoading(true)
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}withdrawal-request/assign-employee`, {
        requestId: requestToAssign.id,
        employeeId: employeeId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prevData) => prevData.map((request) =>
        request.id === requestToAssign.id ? response.data.request : request
      ));
      setIsAssignModalOpen(false);
      setRequestToAssign(null);
      setEmployeeId('');

      setModalOpen(true);
      setMessageType('success');
      setMessage('Assigned Successfully!')
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to Assign')
    }finally{
      setIsLoading(false);
    }
  };

  const handleFinalizeClick = (request) => {
    setRequestToFinalize(request);
    setDepositRefundStatus('');  // Reset status when opening modal
    setIsFinalizeModalOpen(true);
  };

  const handleFinalize = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}withdrawal-request/finalize`, {
        requestId: requestToFinalize.id,
        depositRefundStatus: depositRefundStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData((prevData) =>
        prevData.map((req) => req.id === requestToFinalize.id ? response.data.request : req)
      );
      setIsFinalizeModalOpen(false);
      setRequestToFinalize(null);
      setDepositRefundStatus('');

      setModalOpen(true);
      setMessageType('success');
      setMessage('Finalized Successfully!')
    } catch (error) {
      console.error('Error finalizing request:', error);
      // setErrorMessage('There was an error finalizing the request. Please try again.');

      setModalOpen(true);
      setMessageType('error');
      setMessage('There was an error finalizing the request. Please try again.')
    }finally{
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}withdrawal-request/delete/${requestToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prevData) => prevData.filter((request) => request.id !== requestToDelete.id));
      setIsDeleteModalOpen(false);
      setRequestToDelete(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Deleted Successfully!')
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to Delete data')
    }
  };

  const handleDetailClick = (request) => {
    setSelectedRequest(request);  // Set the request to be displayed in the modal
    setIsDetailsModalOpen(true);  // Open the details modal
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [dropdownStates, setDropdownStates] = useState({});

  const toggleDropdown = (rowId) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [rowId]: !prevStates[rowId],
    }));
  };

// Then in the render part
<div className={`dropdown-menu absolute right-0 mt-2 w-48 rounded-md shadow-lg ${dropdownOpen ? 'block' : 'hidden'}`}>
  {/* Dropdown items */}
</div>
// Add this useEffect to handle clicks outside dropdown
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown-container')) {
      setDropdownStates({});
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);
  const columns = [
    { key: 'tenantId', label: 'Tenant Name', render: (row) => getTenantNameById(row.tenantId) },
    {
      key: 'employeeId',
      label: 'Employee Name',
      render: (row) => {
        const employee = users.find((emp) => emp.id === row.employeeId);
        return employee ? employee.fname : 'Not Assigned';
      },
    },
    { key: 'reason', label: 'Reason' },
    {
      key: 'terminationDate',
      label: 'Termination Date',
      render: (row) => new Date(row.terminationDate).toLocaleDateString()
    },
    { key: 'status', label: 'Status' },
    { key: 'adminResponse', label: 'Admin Response' },
    { key: 'tenantFeedback', label: 'Tenant Feedback' },
    { key: 'depositRefundStatus', label: 'Deposit Refund Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="relative dropdown-container">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded transition-colors duration-200"
            onClick={() => toggleDropdown(row.id)}
          >
            Actions
          </button>
          <div
            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 ${
              dropdownStates[row.id] ? 'block' : 'hidden'
            }`}
          >
            <div className="py-1">
              <button
                onClick={() => handleStatusClick(row)}
                className="block w-full text-left px-4 py-2 text-sm text-white bg-green-500 hover:bg-green-600 transition-colors duration-200"
              >
                Update
              </button>
              <button
                onClick={() => handleAssignClick(row)}
                className="block w-full text-left px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
              >
                Assign
              </button>
              <button
                onClick={() => handleFinalizeClick(row)}
                className="block w-full text-left px-4 py-2 text-sm text-white bg-purple-500 hover:bg-purple-600 transition-colors duration-200"
              >
                Finalize
              </button>
              <button
                onClick={() => handleDeleteClick(row)}
                className="block w-full text-left px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => handleDetailClick(row)}
                className="block w-full text-left px-4 py-2 text-sm text-white bg-gray-500 hover:bg-gray-600 transition-colors duration-200"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      ),
    },
  
    
    
    
  ];

  return (
    <div className="p-6">
      {loading ? (
        <LoadingComponent/>
      ) : (
        <TableComponent
          title="Withdrawal Requests"
          data={data}
          columns={columns}
          showSearch={true}
          exportable={true}
          onAdd={() => console.log('Add new request')}
        />
      )}

      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Update Request Status</h2>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-white-700">Select Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select Status</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="adminResponse" className="block text-sm font-medium text-white-700">Admin Response</label>
              <textarea
                id="adminResponse"
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                rows="4"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsStatusModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleUpdateStatus} className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isLoading}
              >
               {isLoading ? 'Updating...' : 'Update'} 
              </button>
            </div>
          </div>
        </div>
      )}

      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Assign Employee to Request</h2>
            <div className="mb-4">
              <label htmlFor="employeeId" className="block text-sm font-medium text-white-700">Select Employee</label>
              <select
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select Employee</option>
                {users.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fname}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsAssignModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAssign} className="bg-green-500 text-white px-4 py-2 rounded"
               disabled={isLoading}
              >
                {isLoading ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isFinalizeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Finalize Deposit Refund Status</h2>
            <div className="mb-4">
              <label htmlFor="depositRefundStatus" className="block text-sm font-medium text-white-700">Deposit Refund Status</label>
              <select
                id="depositRefundStatus"
                value={depositRefundStatus}
                onChange={(e) => setDepositRefundStatus(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select Status</option>
                <option value="full">Full</option>
                <option value="partial">Partial</option>
                <option value="not_processed">Not Processed</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsFinalizeModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleFinalize} className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isLoading}
              >
               {isLoading ? 'finalizing...' : 'Finalize'} 
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this request?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

{isDetailsModalOpen && selectedRequest && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-base-100 p-6 rounded-lg w-96">
      <h2 className="text-xl mb-4">Request Details</h2>
      <div className="mb-4">
        <p><strong>Tenant Name:</strong> {getTenantNameById(selectedRequest.tenantId)}</p>
        <p><strong>Reason:</strong> {selectedRequest.reason}</p>
        <p><strong>Termination Date:</strong> {new Date(selectedRequest.terminationDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {selectedRequest.status}</p>
        <p><strong>Admin Response:</strong> {selectedRequest.adminResponse}</p>
        <p><strong>Tenant Feedback:</strong> {selectedRequest.tenantFeedback}</p>
        <p><strong>Deposit Refund Status:</strong> {selectedRequest.depositRefundStatus}</p>
      </div>
      <div className="flex justify-end space-x-2">
        <button onClick={() => setIsDetailsModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  </div>
)}

     <Modal 
      isOpen={modalOpen}
      onClose={()=> setModalOpen(false)}
      messageType={messageType}
      message={message}
     
     />
     
    </div>
  );
};

export default WithdrawalRequests;
