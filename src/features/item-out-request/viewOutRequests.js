import React, { useEffect, useState } from 'react';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import Modal from "../../components/Modal";
import api from "../../utils/api";

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
    // fetchTenantItems();
  }, []);

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      const response = await api.get(`item-out-request`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch item out requests');
      setLoading(false);
    }
  };

  // Fetch tenant items for editing (by tenantId)
const fetchTenantItemsForEdit = async (tenantId) => {
  try {
    if (!tenantId) return [];
    const response = await api.get(`tenant-items/${tenantId}/items`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTenantItems(response.data.items || []);
    return response.data.items || [];
  } catch (err) {
    console.error("Failed to load tenant items", err);
    setTenantItems([]);
    return [];
  }
};


const openEditModal = async (request) => {
  console.log("Opening edit modal for request:", request);

  setEditingRequest(request);

  let items = [];
  if (request.tenantId) {
    items = await fetchTenantItemsForEdit(request.tenantId);
    console.log("Tenant items loaded for edit:", items);
  }

  // Determine the correct value for the select/input
  let itemValue = "";
  if (request.item?.id) {
    itemValue = `id-${request.item.id}`;  // Use item.id from request
  } else if (request.name) {
    itemValue = request.name;             // Custom item name
  } else if (items.length > 0) {
    itemValue = `id-${items[0].id}`;     // Fallback to first tenant item
  }

  setFormData({
    itemValue,
    quantity: request.quantity || 1,
  });

  console.log("Form data set for edit:", {
    itemValue,
    quantity: request.quantity || 1,
  });
};

  // Handle form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit edited request
  const submitEdit = async () => {
    const payload = { quantity: parseInt(formData.quantity, 10) };

    // Dropdown value starts with "id-"
    if (formData.itemValue?.startsWith("id-")) {
      payload.tenantItemId = parseInt(formData.itemValue.split("-")[1], 10);
    } else if (formData.itemValue) {
      payload.name = formData.itemValue;
    }

    try {
      await api.put(`item-out-request/${editingRequest.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalOpen(true);
      setMessage("Request updated successfully");
      setMessageType("success");
      fetchRequests();
      closeEditModal();
    } catch (err) {
      setModalOpen(true);
      setMessage(err.response?.data?.error || err.message);
      setMessageType("error");
    }
  };

  const closeEditModal = () => {
    setEditingRequest(null);
    setFormData({});
    setTenantItems([]);
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
      await api.delete(`item-out-request/${requestToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(prev => prev.filter(req => req.id !== requestToDelete));
      setModalOpen(true);
      setMessageType('success');
      setMessage('Request deleted successfully');
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage(err.response?.data?.message || err.message);
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
    {
      label: 'Quantity',
      key: 'quantity',
      render: (row) => row.quantity || row.item?.quantity ||  'N/A',
    },
    { label: 'Status', key: 'status' },
    {
      label: 'Unit',
      key: 'unitNumber',
      render: (row) => row.unitNumber || 'N/A',
    },
    {
      label: 'Floor',
      key: 'floorNumber',
      render: (row) => row.floorNumber || 'N/A',
    },
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
            <button
              onClick={() => isPending && openEditModal(row)}
              disabled={!isPending}
              className={`px-3 py-1 rounded text-white transition-colors duration-200 ${
                isPending ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 opacity-50 cursor-not-allowed'
              }`}
            >
              Edit
            </button>

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
    },
  ];

    if (loading) return <LoadingComponent />;
    if (error) return <div className="text-red-500">Error: {error}</div>;

  const tableData = requests.length > 0 ? requests[0].requests : [];

  return (
    <>
      <TableComponent
        title="My Item Out Requests"
        data={tableData}
        columns={columns}
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

            <div className="space-y-4">
              {/* Item select or input */}
              {tenantItems.length > 0 ? (
                <div>
                  <label className="block mb-1 font-medium">Item</label>
                  <select
                    name="itemValue"
                    value={formData.itemValue || ""}
                    onChange={handleEditChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select item</option>
                    {tenantItems.map(item => (
                      <option key={item.id} value={`id-${item.id}`}>
                        {item.itemName} (Available: {item.quantity})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block mb-1 font-medium">Item Name</label>
                  <input
                    type="text"
                    value={formData.itemValue || ""}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, itemValue: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter item name"
                  />
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block mb-1 font-medium">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity || 1}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, quantity: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={submitEdit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>

              <button
                type="button"
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
