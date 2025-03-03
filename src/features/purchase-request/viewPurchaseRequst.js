import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table'; 
import DeleteConfirmationModal from '../../components/editDeleteModal'
import Modal from '../../components/Modal'

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
  const [loadingItems, setLoadingItems] = useState(true); 
  const [loadingUsers, setLoadingUsers] = useState(true); 

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
    vendorName: '',
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
  
    fetchItems();
    fetchUsers();
  }, []);

  const handleEditClick = (request) => {
    setSelectedRequest(request); 
    setEditFormData({
      itemId: request.itemId,
      requestedBy: request.requestedBy,
      status: request.status,
      amount: request.amount,
      requestDate: request.requestDate.split('T')[0], 
      reason: request.reason,
      approvedBy: request.approvedBy,
      vendorName: request.vendorName,
      vendorPhone: request.vendorPhone
    });
    setIsEditModalOpen(true); 
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}purchases-request/${selectedRequest.id}`,
        editFormData
      );
      setData((prevData) =>
        prevData.map(request =>
          request.id === selectedRequest.id
            ? {
                ...request,
                status: response.data.status,
                amount: response.data.amount,
                requestDate: response.data.requestDate,
                reason: response.data.reason,
                vendorName: response.data.vendorName,
                vendorPhone: response.data.vendorPhone,
              }
            : request
        )
      );

      setData(data.map(request =>
        request.id === selectedRequest.id ? response.data : request
      ));
      setIsEditModalOpen(false); 

      setModalOpen(true);
      setMessageType('success');
      setMessage(' Request updated successfully!')
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to edit Request!')
    }finally {
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
      setMessage('Request deleted successfully!')
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete request!')
    }
  };

  const handleDetailClick = (request) => {
    setSelectedDetailRequest(request); // Store the selected request for details
    setIsDetailModalOpen(true); // Open the details modal
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false); // Close the details modal
    setSelectedDetailRequest(null); // Reset selected request
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
    { label: 'Vendor Name', key: 'vendorName' },
    // { label: 'Vendor Phone', key: 'vendorPhone' },
    // { label: 'Amount', key: 'amount' },
    // { 
    //   label: 'Request Date', 
    //   key: 'requestDate', 
    //   render: (row) => {
    //     if (row.requestDate) {
    //       const date = new Date(row.requestDate);
    //       return date.toLocaleDateString('en-US'); 
    //     }
    //     return 'N/A';
    //   }
    // },
    { label: 'Status', key: 'status' },
    { 
      label: 'Approved By', 
      key: 'approvedby.fname', 
      render: (row) => row.approvedby ? `${row.approvedby.fname} ${row.approvedby.lname}` : 'N/A' 
    },
    { label: 'Reason', key: 'reason' },
    // { label: 'Item Category', key: 'item.itemCategory', render: (row) => row.item ? row.item.itemCategory : 'N/A' },
    // { 
    //     label: 'Item Expiration', 
    //     key: 'item.expirationDate', 
    //     render: (row) => {
    //       if (row.item && row.item.expirationDate) {
    //         const date = new Date(row.item.expirationDate);
    //         return date.toLocaleDateString('en-US'); 
    //       }
    //       return 'N/A';
    //     }
    // },
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
         onClick={() => handleDeleteClick(row)} // Trigger delete confirmation modal
         className="bg-red-500 text-white px-4 py-2 rounded-md"
       >
         Delete
       </button>
       <button
          onClick={() => handleDetailClick(row)} // Trigger details modal
          className="bg-gray-400 text-white px-4 py-2 rounded-md"
        >
          Details
        </button>
       </div>
      ),
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6">
      <TableComponent
        title="Purchase Requests"
        data={data}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      />

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto mt-12">
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
                    <option>Loading...</option>
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
                    <option>Loading...</option>
                  ) : (
                    users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fname} 
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                >
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

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

              <div className="mb-4">
                <label className="block text-sm font-medium">Approved By</label>
                <select
                  value={editFormData.approvedBy}
                  onChange={(e) => setEditFormData({ ...editFormData, approvedBy: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                >
                  {loadingUsers ? (
                    <option>Loading...</option>
                  ) : (
                    users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fname} 
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Vendor Name</label>
                <input
                  type="text"
                  value={editFormData.vendorName}
                  onChange={(e) => setEditFormData({ ...editFormData, vendorName: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Vendor Phone</label>
                <input
                  type="text"
                  value={editFormData.vendorPhone}
                  onChange={(e) => setEditFormData({ ...editFormData, vendorPhone: e.target.value })}
                  className="mt-1 bg-base-100 w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...': 'Save '}
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
      <p><strong>Vendor Name:</strong> {selectedDetailRequest.vendorName}</p>
      <p><strong>Vendor Phone:</strong> {selectedDetailRequest.vendorPhone}</p>
      <p><strong>Amount:</strong> {selectedDetailRequest.amount}</p>
      <p><strong>Request Date:</strong> {new Date(selectedDetailRequest.requestDate).toLocaleDateString('en-US')}</p>
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
       onClose={()=> setModalOpen(false)}
       messageType={messageType}
       message={message}
      />

    </div>
  );
};

export default PurchasesRequestPage;