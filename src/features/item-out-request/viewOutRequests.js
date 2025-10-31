import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import Modal from "../../components/Modal";

const TenantItemOutRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const [editingRequest, setEditingRequest] = useState(null); 
  const [tenantItems, setTenantItems] = useState([]); 
  const [formData, setFormData] = useState({});
  
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
    fetchTenantItems();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}item-out-request`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch item out requests');
      setLoading(false);
    }
  };

  const fetchTenantItems = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant-items/my-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTenantItems(res.data);
    } catch (err) {
      console.error('Failed to load tenant items', err);
    }
  };

  const openEditModal = (request) => {
    setEditingRequest(request);
    setFormData({
      tenantItemId: request.tenantItemId || '',
      name: request.name || '',
      quantity: request.quantity,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitEdit = async () => {
    const payload = {
      quantity: parseInt(formData.quantity, 10),
    };

    if (editingRequest.tenantItemId) {
      payload.tenantItemId = parseInt(formData.tenantItemId, 10);
    } else {
      payload.name = formData.name;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}item-out-request/${editingRequest.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModalOpen(true);
      setMessageType('success');
      setMessage('Request Updated successfully');
      await fetchRequests();
      setEditingRequest(null);
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage((err.response?.data?.error || err.message));
    }
  };

  const closeEditModal = () => {
    setEditingRequest(null);
    setFormData({});
  };

  const openDeleteModal = (id) => {
    setRequestToDelete(id);
    setShowConfirmModal(true);
  };

  const closeDeleteModal = () => {
    setShowConfirmModal(false);
    setRequestToDelete(null);
  };

  const handleDelete = async () => {
    if (!requestToDelete) return;
    setDeletingId(requestToDelete);
    setShowConfirmModal(false);
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}item-out-request/${requestToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests((prev) => prev.filter((req) => req.id !== requestToDelete));
      setModalOpen(true);
      setMessageType('success');
      setMessage('Request deleted successfully');
    } catch (err) {
      //alert('Failed to delete request: ' + (err.response?.data?.message || err.message));
      setModalOpen(true);
      setMessageType('error');
      setMessage((err.response?.data?.message || err.message));
    } finally {
      setDeletingId(null);
      setRequestToDelete(null);
    }
  };

  const columns = [
  {
    label: 'Item Name',
    key: 'itemName',
    render: (row) => row.item?.itemName || row.name || 'N/A',
  },
  { label: 'Quantity', key: 'quantity' },
  { label: 'Status', key: 'status' },
  {
    label: 'Requested At',
    key: 'createdAt',
    isDate: true,
  },
  {
  label: 'Actions',
  key: 'actions',
  render: (row) => {
    const isPending = row.status === 'Pending';
    const isDeleting = deletingId === row.id;

    return (
      <div className="flex gap-2">
        {/* Edit Button */}
        <button
          onClick={() => isPending && openEditModal(row)}
          disabled={!isPending}
          className={`px-3 py-1 rounded text-white transition-colors duration-200 ${
            isPending
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-600 opacity-50 cursor-not-allowed'
          }`}
        >
          Edit
        </button>

        {/* Delete Button */}
        <button
          onClick={() => isPending && openDeleteModal(row.id)}
          disabled={!isPending || isDeleting}
          className={`px-3 py-1 rounded text-white transition-colors duration-200 ${
            isPending
              ? isDeleting
                ? 'bg-red-600 opacity-50 cursor-wait'
                : 'bg-red-600 hover:bg-red-700'
              : 'bg-red-600 opacity-50 cursor-not-allowed'
          }`}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    );
  },
}

];


  if (loading) return <LoadingComponent />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
      <TableComponent
        title="My Item Out Requests"
        data={requests}
        columns={columns}
        rowsPerPageOptions={[5, 10, 20]}
        showSearch={true}
        exportable={true}
      />

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full text-center shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this pending request?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Request</h2>

            <form className="space-y-4">
              {editingRequest.tenantItemId ? (
                <>
                  <div>
                    <label className="block mb-1 font-medium">Item</label>
                    <select
                      name="tenantItemId"
                      value={formData.tenantItemId}
                      onChange={handleEditChange}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select item</option>
                      {tenantItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.itemName}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block mb-1 font-medium">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}
              <div>
                <label className="block mb-1 font-medium">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleEditChange}
                  min="1"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </form>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={submitEdit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
              <button
                onClick={closeEditModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </>
  );
};

export default TenantItemOutRequests;
