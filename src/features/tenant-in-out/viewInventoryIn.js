import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import DeleteConfirmationModal from '../../components/editDeleteModal'
import Modal from '../../components/Modal'

const TenantInventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentInventory, setCurrentInventory] = useState({
    items: [] // Default items as an empty array to prevent map errors
  });
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false); 
  const [inventoryToDelete, setInventoryToDelete] = useState(null); 

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setmessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchInventoryData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/tenant-inventory', {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
        if (response.data.success) {
          const formattedData = response.data.inventories.map(inventory => {
            let items = [];
            try {
              items = JSON.parse(inventory.items) || [];
            } catch (e) {
              if (inventory.items && inventory.items.trim() !== "") {
                items = inventory.items.split(", ").map(item => ({
                  name: item.split(' (')[0],
                  condition: item.split('Condition: ')[1]?.split(',')[0],
                  quantity: parseInt(item.split('Quantity: ')[1], 10) || 0
                }));
              }
            }

            return {
              id: inventory.id,
              tenantName: inventory.Tenant.fullName,
              tenantEmail: inventory.Tenant.email,
              tenantPhone: inventory.Tenant.phoneNumber,
              type: inventory.type,
              checkedBy: inventory.checkedBy,
              notes: inventory.notes,
              items: items.map(item => `${item.name} (Condition: ${item.condition}, Quantity: ${item.quantity})`).join(", "),
            };
          });
          setInventoryData(formattedData);
        }
      } catch (err) {
        setError("Failed to fetch inventory data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  const openEditModal = (inventory) => {
    let items = [];
    try {
      items = JSON.parse(inventory.items) || [];
    } catch (e) {
      if (inventory.items && inventory.items.trim() !== "") {
        items = inventory.items.split(", ").map(item => ({
          name: item.split(' (')[0],
          condition: item.split('Condition: ')[1]?.split(',')[0],
          quantity: parseInt(item.split('Quantity: ')[1], 10) || 0
        }));
      }
    }

    setCurrentInventory({
      ...inventory,
      items: items,
    });
    setEditModalVisible(true);
  };

  const openDeleteModal = (inventory) => {
    setInventoryToDelete(inventory); // Set the inventory item to be deleted
    setDeleteModalVisible(true); // Show the delete confirmation modal
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setInventoryToDelete(null);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`https://apartment.houseethiopia.com/api/tenant-inventory/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (response.data.success) {
        // Remove the deleted inventory from the state
        setInventoryData((prevData) => prevData.filter(item => item.id !== id));
        closeDeleteModal(); // Close the delete confirmation modal
      }
    } catch (err) {
      setError("Failed to delete inventory data.");
    }
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setCurrentInventory({
      items: [] // Reset items to an empty array
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const updatedData = {
      tenantId: currentInventory.tenantId,
      type: currentInventory.type,
      items: currentInventory.items,
      notes: currentInventory.notes,
    };

    try {
      const response = await axios.put(`https://apartment.houseethiopia.com/api/tenant-inventory/${currentInventory.id}`, updatedData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (response.data.success) {
        setInventoryData(prevData =>
          prevData.map(item =>
            item.id === currentInventory.id ? { ...item, ...updatedData } : item
          )
        );
        closeEditModal();
        setModalOpen(true);
        setmessageType('success');
        setMessage('Data updated successfully!');
      }
    } catch (err) {
      setModalOpen(true);
      setmessageType('error');
      setMessage('Unable to update the data!');
    }
  };

  const handleAddItem = () => {
    setCurrentInventory(prev => ({
      ...prev,
      items: [...prev.items, { name: '', condition: '', quantity: 0 }]
    }));
  };

  const handleRemoveItem = (index) => {
    const newItems = [...currentInventory.items];
    newItems.splice(index, 1);
    setCurrentInventory(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const columns = [
    { label: 'Tenant Name', key: 'tenantName' },
    { label: 'Tenant Email', key: 'tenantEmail' },
    { label: 'Tenant Phone', key: 'tenantPhone' },
    { label: 'Inventory Type', key: 'type' },
    { label: 'Checked By', key: 'checkedBy' },
    { label: 'Notes', key: 'notes' },
    { label: 'Items', key: 'items' },
    { label: 'Actions', key: 'actions', render: (row) => (
        <div className="flex space-x-2">
          <button onClick={() => openEditModal(row)} 
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white ml-2"
          >
            Edit
          </button>
          <button onClick={() => openDeleteModal(row)} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white ml-2"
          >
            Delete
          </button>
        </div>
      )},
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
        title="Tenant Inventory List"
        data={inventoryData}
        columns={columns}
        exportable={true}
        showSearch={true}
      />

      {/* Edit Modal */}
      {editModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Inventory</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Inventory Type</label>
                <select
                  className="p-2 w-full border border-gray-300 rounded-md"
                  value={currentInventory.type}
                  onChange={(e) => setCurrentInventory((prev) => ({ ...prev, type: e.target.value }))}>
                  <option value="move-in">Move-in</option>
                  <option value="move-out">Move-out</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Notes</label>
                <textarea
                  className="p-2 w-full border border-gray-300 rounded-md"
                  value={currentInventory.notes}
                  onChange={(e) => setCurrentInventory((prev) => ({ ...prev, notes: e.target.value }))} />
              </div>

              {/* Render Items (Dynamic) */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Items</label>
                 {currentInventory.items.map((item, index) =>
                   (
                      <div key={index} className="flex mb-2 space-x-4">
                        <input
                          type="text"
                          className="p-2 w-full border border-gray-300 rounded-md"
                          value={item.name} // Ensure you're accessing `name` here
                          onChange={(e) => {
                            const newItems = [...currentInventory.items];
                            newItems[index].name = e.target.value; // Update the `name` property
                            setCurrentInventory((prev) => ({ ...prev, items: newItems }));
                          }}
                        />
                        <input
                          type="text"
                          className="p-2 w-full border border-gray-300 rounded-md"
                          value={item.condition} // Ensure you're accessing `condition` here
                          onChange={(e) => {
                            const newItems = [...currentInventory.items];
                            newItems[index].condition = e.target.value; 
                            setCurrentInventory((prev) => ({ ...prev, items: newItems }));
                          }}
                        />
                        <input
                          type="number"
                          className="p-2 w-full border border-gray-300 rounded-md"
                          value={item.quantity} // Ensure you're accessing `quantity` here
                          onChange={(e) => {
                            const newItems = [...currentInventory.items];
                            newItems[index].quantity = e.target.value; // Update the `quantity` property
                            setCurrentInventory((prev) => ({ ...prev, items: newItems }));
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)} // This will remove an item
                          className="text-red-500 hover:text-red-700">
                          Remove
                        </button>
                      </div>
                    ))
                  }
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2">
                      Add Item
                    </button>
               </div>

              <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-md">
                Save Changes
              </button>
              <button type="button" onClick={closeEditModal} className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalVisible}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        data={inventoryToDelete}
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

export default TenantInventoryPage;
