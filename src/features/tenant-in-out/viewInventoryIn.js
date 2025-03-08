import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import DeleteConfirmationModal from '../../components/editDeleteModal';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const TenantInventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentInventory, setCurrentInventory] = useState({
    id: null,
    tenantId: null,
    type: '',
    notes: '',
    items: [],
  });
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch inventory data
  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/tenant-inventory', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const formattedData = response.data.inventories.map((inventory) => ({
            id: inventory.id,
            tenantName: inventory.Tenant.fullName,
            tenantEmail: inventory.Tenant.email,
            tenantPhone: inventory.Tenant.phoneNumber,
            type: inventory.type,
            checkedBy: inventory.checkedBy,
            notes: inventory.notes || '',
            items: inventory.items, // Keep as raw JSON string; parsing happens in render
          }));
          setInventoryData(formattedData);
        }
      } catch (err) {
        setError('Unable to fetch inventory data');
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to get the data!');
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  const openEditModal = (inventory) => {
    let items = [];
    try {
      items = Array.isArray(JSON.parse(inventory.items)) ? JSON.parse(inventory.items) : [];
    } catch (e) {
      console.error('Failed to parse items:', e);
      items = []; // Fallback to empty array
    }

    setCurrentInventory({
      id: inventory.id,
      tenantId: inventory.Tenant?.id || null, // Handle missing Tenant object
      type: inventory.type || '',
      notes: inventory.notes || '',
      items: items.length ? items : [{ name: '', condition: '', quantity: 0 }],
    });
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setCurrentInventory({ id: null, tenantId: null, type: '', notes: '', items: [] });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Validate items
    if (currentInventory.items.length === 0) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('At least one item is required!');
      return;
    }

    const updatedData = {
      tenantId: currentInventory.tenantId || undefined, // Optional field
      type: currentInventory.type || undefined, // Optional field
      items: currentInventory.items.length ? JSON.stringify(currentInventory.items) : undefined, // Optional but must have at least one item if provided
      notes: currentInventory.notes || undefined, // Optional field
    };

    try {
      const response = await axios.put(
        `https://apartment.houseethiopia.com/api/tenant-inventory/${currentInventory.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setInventoryData((prevData) =>
          prevData.map((item) =>
            item.id === currentInventory.id
              ? {
                  ...item,
                  type: updatedData.type,
                  notes: updatedData.notes,
                  items: updatedData.items, // Keep as JSON string for consistency with API
                }
              : item
          )
        );
        closeEditModal();
        setModalOpen(true);
        setMessageType('success');
        setMessage('Inventory updated successfully!');
      }
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Failed to update inventory!');
    }
  };

  const handleDelete = async () => {
    if (!inventoryToDelete?.id) return;

    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(
        `https://apartment.houseethiopia.com/api/tenant-inventory/${inventoryToDelete.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setInventoryData((prev) => prev.filter((item) => item.id !== inventoryToDelete.id));
        setModalOpen(true);
        setMessageType('success');
        setMessage('Inventory deleted successfully!');
      }
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Failed to delete inventory!');
    } finally {
      setDeleteModalVisible(false);
      setInventoryToDelete(null);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...currentInventory.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setCurrentInventory((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setCurrentInventory((prev) => ({
      ...prev,
      items: [...prev.items, { name: '', condition: '', quantity: 0 }],
    }));
  };

  const handleRemoveItem = (index) => {
    setCurrentInventory((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const columns = [
    { label: 'Tenant Name', key: 'tenantName' },
    { label: 'Tenant Email', key: 'tenantEmail' },
    { label: 'Tenant Phone', key: 'tenantPhone' },
    { label: 'Inventory Type', key: 'type' },
    { label: 'Checked By', key: 'checkedBy' },
    { label: 'Notes', key: 'notes' },
    {
      label: 'Items',
      key: 'items',
      render: (row) => {
        let items = [];
        try {
          items = Array.isArray(JSON.parse(row.items)) ? JSON.parse(row.items) : [];
        } catch (e) {
          console.error('Failed to parse items:', e);
        }
        return (
          <ul className="list-disc pl-4">
            {items.map((item, index) => (
              <li key={index}>
                {item.name} (Condition: {item.condition}, Quantity: {item.quantity})
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openEditModal(row)}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setInventoryToDelete(row);
              setDeleteModalVisible(true);
            }}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <LoadingComponent />
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <TableComponent
          title="Tenant Inventory List"
          data={inventoryData}
          columns={columns}
          exportable={true}
          showSearch={true}
        />
      )}

      {/* Edit Modal */}
      {editModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Inventory</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Inventory Type</label>
                <select
                  className="p-2 w-full border border-gray-300 rounded-md"
                  value={currentInventory.type}
                  onChange={(e) => setCurrentInventory((prev) => ({ ...prev, type: e.target.value }))}
                  required
                >
                  <option value="move-in">Move-in</option>
                  <option value="move-out">Move-out</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  className="p-2 w-full border border-gray-300 rounded-md"
                  value={currentInventory.notes}
                  onChange={(e) => setCurrentInventory((prev) => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Items</label>
                {currentInventory.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="p-2 flex-1 border border-gray-300 rounded-md"
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="p-2 flex-1 border border-gray-300 rounded-md"
                      placeholder="Condition"
                      value={item.condition}
                      onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      className="p-2 w-24 border border-gray-300 rounded-md"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="0"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={currentInventory.items.length === 1} // Prevent removing the last item
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-blue-500 text-white py-1 px-3 rounded-md mt-2 hover:bg-blue-600"
                >
                  Add Item
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setInventoryToDelete(null);
        }}
        onDelete={handleDelete}
        data={inventoryToDelete}
      />

      {/* Message Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default TenantInventoryPage;