import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table'; 
import DeleteConfirmationModal from '../../components/editDeleteModal';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const PurchasesRequestPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); 
  const [selectedDetailRequest, setSelectedDetailRequest] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const [items, setItems] = useState([]); 
  const [users, setUsers] = useState([]); 
  const [vendors, setVendors] = useState([]); // Added vendors state
  const [loadingItems, setLoadingItems] = useState(true); 
  const [loadingUsers, setLoadingUsers] = useState(true); 
  const [loadingVendors, setLoadingVendors] = useState(true); // Added loadingVendors state

  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [selectedRequest, setSelectedRequest] = useState(null); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    itemId: '',
    requestedBy: '',
    status: '',
    amount: '',
    requestDate: '',
    reason: '',
    approvedBy: '',
    vendorId: '', // Changed from vendorName to vendorId
    vendorPhone: ''
  }); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}purchases-request`);
        setData(response.data); 
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}items`);
        setItems(response.data); 
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setLoadingItems(false);
      }
    };
  
    const fetchUsers = async () => {
      const token = localStorage.getItem('token'); 
      if (!token) {
        console.error("Token not found");
        return;
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}auth/users`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        setUsers(response.data.users); 
        console.log(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchVendors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}vendors`);
        setVendors(response.data);
      } catch (err) {
        console.error('Error fetching vendors:', err);
      } finally {
        setLoadingVendors(false);
      }
    };
  
    fetchItems();
    fetchUsers();
    fetchVendors();
  }, []);

  const handleEditClick = (request) => {
    setSelectedRequest(request); 
    setEditFormData({
      itemId: request.itemId,
      requestedBy: request.requestedBy,
      // status: request.status,
      amount: request.amount,
      requestDate: request.requestDate.split('T')[0], 
      reason: request.reason,
      // approvedBy: request.approvedBy,
      vendorId: request.vendorId || '', // Changed from vendorName to vendorId
      vendorPhone: request.vendorPhone
    });
    setIsEditModalOpen(true); 
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
  
    // Optimistically update the state before server response
    setData((prevData) => {
      const updatedData = prevData.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              ...editFormData, // Apply the edit form data to the request
              item: items.find(item => item.id === editFormData.itemId), // Update item info optimistically
              requestedby: users.find(user => user.id === editFormData.requestedBy), // Update requestedBy info optimistically
            }
          : request
      );
      return [...updatedData]; // Ensure a new reference is returned
    });
  
    try {
      // Send the update to the server
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}purchases-request/${selectedRequest.id}`,
        editFormData
      );
  
      // On success, update with the server response
      setData((prevData) =>
        prevData.map((request) =>
          request.id === selectedRequest.id ? response.data : request
        )
      );
  
      setIsEditModalOpen(false);
      setModalOpen(true);
      setMessageType('success');
      setMessage('Request updated successfully!');
    } catch (error) {
      console.error('Error during request:', error.response?.data || error);
  
      // Rollback to the previous state if the request fails
      setData((prevData) =>
        prevData.map((request) =>
          request.id === selectedRequest.id
            ? { ...request, ...editFormData }
            : request
        )
      );
  
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to edit Request!');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDeleteClick = (request) => {
    setSelectedRequest(request); 
    setIsDeleteModalOpen(true); 
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}purchases-request/${id}`);
      setData(data.filter(request => request.id !== id)); 
      setIsDeleteModalOpen(false); 
      setModalOpen(true);
      setMessageType('success');
      setMessage('Request deleted successfully!');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete request!');
    }
  };

  const handleDetailClick = (request) => {
    setSelectedDetailRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDetailRequest(null);
  };

  const columns = [
    { 
      label: 'Item Name', 
      key: 'item.itemName', 
      render: (row) => row.item ? row.item.itemName : 'N/A' 
    },
    { 
      label: 'Requested By', 
      key: 'requestedby.fname', 
      render: (row) => row.requestedby ? `${row.requestedby.fname} ${row.requestedby.lname}` : 'N/A' 
    },
    
    { 
      label: 'Vendor Name', 
      key: 'vendorId', 
      render: (row) => {
        const vendor = vendors.find(v => v.id === row.vendorId);
        return vendor ? vendor.fname : row.vendorName || 'N/A';
      }
    },
    // { label: 'Status', key: 'status' },
    // { 
    //   label: 'Approved By', 
    //   key: 'approvedby.fname', 
    //   render: (row) => row.approvedby ? `${row.approvedby.fname} ${row.approvedby.lname}` : 'N/A' 
    // },
    { label: 'Reason', key: 'reason' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className='flex space-x-1'>
          <button
            onClick={() => handleEditClick(row)} 
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={() => handleDetailClick(row)}
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Details
          </button>
        </div>
      ),
    }
  ];

  if (error) {
    return <div>{error}</div>;
  }
  const handleAddClick = () => {
    window.location.href = '/app/add-purchase-request';
   };
  return (
    <div>
      {loading ? (<LoadingComponent/>) : (
        <TableComponent
          title="Purchase Requests"
          data={data}
          columns={columns}
          rowsPerPageOptions={[5, 10, 15]}
          showSearch={true}
          exportable={true}
          onAdd={handleAddClick}
        />
      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-h-[80vh] overflow-y-auto mt-12">
            <h2 className="text-xl font-semibold mb-4">Edit Purchase Request</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium">Item Name</label>
                <select
                  value={editFormData.itemId}
                  onChange={(e) => setEditFormData({ ...editFormData, itemId: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                >
                  {loadingItems ? (
                    <option>Loading.</option>
                  ) : (
                    items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.itemName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Requested By</label>
                <select
                  value={editFormData.requestedBy}
                  onChange={(e) => setEditFormData({ ...editFormData, requestedBy: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                >
                  {loadingUsers ? (
                    <option>Loading.</option>
                  ) : (
                    users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fname}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* <div className="mb-4">
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                >
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div> */}

              <div className="mb-4">
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  value={editFormData.amount}
                  onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Request Date</label>
                <input
                  type="date"
                  value={editFormData.requestDate}
                  onChange={(e) => setEditFormData({ ...editFormData, requestDate: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Reason</label>
                <textarea
                  value={editFormData.reason}
                  onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                />
              </div>

              {/* <div className="mb-4">
                <label className="block text-sm font-medium">Approved By</label>
                <select
                  value={editFormData.approvedBy}
                  onChange={(e) => setEditFormData({ ...editFormData, approvedBy: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                >
                  {loadingUsers ? (
                    <option>Loading.</option>
                  ) : (
                    users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fname}
                      </option>
                    ))
                  )}
                </select>
              </div> */}

              <div className="mb-4">
                <label className="block text-sm font-medium">Vendor</label>
                <select
                  value={editFormData.vendorId}
                  onChange={(e) => setEditFormData({ ...editFormData, vendorId: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Select Vendor</option>
                  {loadingVendors ? (
                    <option>Loading...</option>
                  ) : (
                    vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.fname} {/* This is what will be displayed in the dropdown */}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* <div className="mb-4">
                <label className="block text-sm font-medium">Vendor Phone</label>
                <input
                  type="text"
                  value={editFormData.vendorPhone}
                  onChange={(e) => setEditFormData({ ...editFormData, vendorPhone: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                />
              </div> */}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedDetailRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto mt-12">
            <h2 className="text-xl font-semibold mb-4">Request Details</h2>
            <p><strong>Item Name:</strong> {selectedDetailRequest.item ? selectedDetailRequest.item.itemName : 'N/A'}</p>
            <p><strong>Requested By:</strong> {selectedDetailRequest.requestedby ? `${selectedDetailRequest.requestedby.fname} ${selectedDetailRequest.requestedby.lname}` : 'N/A'}</p>
            <p><strong>Approved By:</strong> {selectedDetailRequest.approvedby ? `${selectedDetailRequest.approvedby.fname} ${selectedDetailRequest.approvedby.lname}` : 'N/A'}</p>
            <p><strong>Vendor Name:</strong> {vendors.find(v => v.id === selectedDetailRequest.vendorId)?.fname || selectedDetailRequest.vendorName || 'N/A'}</p>
            <p><strong>Vendor Phone:</strong> {selectedDetailRequest.vendorPhone}</p>
            <p><strong>Amount:</strong> {selectedDetailRequest.amount}</p>
            <p><strong>Request Date:</strong> {new Date(selectedDetailRequest.requestDate).toISOString().split('T')[0]}</p>
            <p><strong>Status:</strong> {selectedDetailRequest.status}</p>
            <p><strong>Reason:</strong> {selectedDetailRequest.reason}</p>
            <button
              onClick={handleCloseDetailModal}
              className="bg-gray-400 text-white px-4 py-2 rounded-md mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )} 

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete} 
        data={selectedRequest} 
      />
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default PurchasesRequestPage;