import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table';

const WithdrawalRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [employees, setEmployees] = useState([]);
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
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/tenant', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTenants(response.data);
      } catch (error) {
        console.error("Error fetching tenants: ", error);
      }
    };

    fetchTenants();
  }, [token]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data.users);
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchEmployees();
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
    try {
      const response = await axios.put('https://apartment.houseethiopia.com/api/withdrawal-request/review', {
        requestId: requestToUpdate.id,
        status: status,
        adminResponse: adminResponse,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prevData) => prevData.map((request) =>
        request.id === requestToUpdate.id ? response.data.request : request
      ));
      setIsStatusModalOpen(false);
      setRequestToUpdate(null);
      setStatus('');
      setAdminResponse('');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAssignClick = (request) => {
    setRequestToAssign(request);
    setIsAssignModalOpen(true);
  };

  const handleAssign = async () => {
    try {
      const response = await axios.put('https://apartment.houseethiopia.com/api/withdrawal-request/assign-employee', {
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
    } catch (error) {
      console.error('Error assigning employee:', error);
    }
  };

  const handleFinalizeClick = (request) => {
    setRequestToFinalize(request);
    setIsFinalizeModalOpen(true);
  };

  const handleFinalize = async () => {
    try {
      const response = await axios.put('https://apartment.houseethiopia.com/api/withdrawal-request/finalize', {
        requestId: requestToFinalize.id,
        depositRefundStatus: depositRefundStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prevData) => prevData.map((req) =>
        req.id === requestToFinalize.id ? response.data.request : req
      ));
      setIsFinalizeModalOpen(false);
      setRequestToFinalize(null);
      setDepositRefundStatus('');
    } catch (error) {
      console.error('Error finalizing request:', error);
    }
  };

  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    setIsDeleteModalOpen(true);
  };
  
  const handleDelete = async () => {
    try {
      await axios.delete(`https://apartment.houseethiopia.com/api/withdrawal-request/delete/${requestToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prevData) => prevData.filter((request) => request.id !== requestToDelete.id));
      setIsDeleteModalOpen(false);
      setRequestToDelete(null);
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const columns = [
    { key: 'tenantId', label: 'Tenant Name', render: (row) => getTenantNameById(row.tenantId) },
    { key: 'reason', label: 'Reason' },
    {
      key: 'terminationDate',
      label: 'Termination Date',
      render: (row) => new Date(row.terminationDate).toLocaleDateString()
    },
    { key: 'status', label: 'Status' },
    { Key: 'adminResponse' , label: 'Admin Response'},
    { key: 'tenantFeedback', label: 'Tenant Feedback' },
    { key: 'depositRefundStatus', label: 'Deposit Refund Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex space-x-1">
          <button
            onClick={() => handleStatusClick(row)}
            className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
          >
            Update
          </button>
          <button
            onClick={() => handleAssignClick(row)}
            className="bg-green-400 text-white py-1 px-2 rounded"
          >
            Assign
          </button>
          <button
            onClick={() => handleFinalizeClick(row)}
            className="bg-grey-500 text-white py-1 px-2 rounded"
          >
            Finalize
          </button>
          <button
        onClick={() => handleDeleteClick(row)}
        className="bg-red-500 text-white py-1 px-2 rounded"
      >
        Delete
      </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {loading ? (
        <p>Loading...</p>
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
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Update Request Status</h2>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Select Status</label>
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
              <label htmlFor="adminResponse" className="block text-sm font-medium text-gray-700">Admin Response</label>
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
              <button onClick={handleUpdateStatus} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
            </div>
          </div>
        </div>
      )}

      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Assign Employee to Request</h2>
            <div className="mb-4">
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Select Employee</label>
              <select
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fname}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsAssignModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAssign} className="bg-green-500 text-white px-4 py-2 rounded">Assign</button>
            </div>
          </div>
        </div>
      )}

      {isFinalizeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Finalize Deposit Refund Status</h2>
            <div className="mb-4">
              {/* <label htmlFor="depositRefundStatus" className="block text-sm font-medium text-white-700">Deposit Refund Status</label> */}
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
              <button onClick={handleFinalize} className="bg-blue-500 text-white px-4 py-2 rounded">Finalize</button>
            </div>
          </div>
        </div>
      )}

{isDeleteModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-base-100 p-6 rounded-lg w-98">
      <p className="text-md">Are you sure you want to delete this request?</p>
      <div className="flex justify-end space-x-2">
        <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default WithdrawalRequests;