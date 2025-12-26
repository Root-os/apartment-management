import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import LoadingComponent from "../../components/loading";
import Modal from "../../components/Modal";
import DeleteConfirmationModal from "../../components/editDeleteModal";
import { useNavigate } from "react-router-dom";
import api from '../../utils/api';


const TenantInventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const navigate = useNavigate();

  const [currentInventory, setCurrentInventory] = useState({
    id: null,
    tenantId: null,
    type: "",
    notes: "",
    items: [],
  });
  const [inventoryToDelete, setInventoryToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `tenant-inventory`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "API request failed");
        }

const formattedData = response.data.tenants.map((tenant, index) => ({
  id: index, // UI key
  phoneNumber: tenant.phoneNumber,
  tenantName: tenant.fullName,
  tenantEmail: tenant.email,
  inventories: tenant.units, // keep inventories nested
}));
        setInventoryData(formattedData);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Unable to fetch inventory data";
        setError(errorMessage);
        setModalOpen(true);
        setMessageType("error");
        setMessage(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

const openEditModal = (inventory) => {
  setCurrentInventory({
    id: inventory.inventoryId,
    tenantId: inventory.tenantId,
    type: inventory.type,
    notes: inventory.notes,
    items: inventory.items.map((item) => ({
      name: item.itemName,
      quantity: item.quantity,
    })),
  });
  setEditModalVisible(true);
};


  const closeEditModal = () => {
    setEditModalVisible(false);
    setCurrentInventory({
      id: null,
      tenantId: null,
      type: "",
      notes: "",
      items: [],
    });
  };

  const openDeleteModal = (inventory) => {
    setInventoryToDelete(inventory);
    setDeleteModalVisible(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setModalOpen(true);
      setMessageType("error");
      setMessage("Authentication token missing");
      return;
    }

    try {
      const response = await api.delete(
        `tenant-inventory/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        setInventoryData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
        setModalOpen(true);
        setMessageType("success");
        setMessage("Inventory deleted successfully!");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete inventory";
      setModalOpen(true);
      setMessageType("error");
      setMessage(errorMessage);
    }
  };

const handleEditSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  
  const updatedData = {
    type: currentInventory.type,
    notes: currentInventory.notes,
    items: currentInventory.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
    })),
  };

  try {
    setLoading(true);
    const response = await api.put(
      `tenant-inventory/${currentInventory.id}`,
      updatedData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.data.success) throw new Error("Update failed");

    // Update local state
    setInventoryData((prevData) =>
      prevData.map((tenant) => {
        if (tenant.phoneNumber === selectedInventory.phoneNumber) {
          return {
            ...tenant,
            inventories: tenant.inventories.map((inv) =>
              inv.inventoryId === currentInventory.id
                ? { ...inv, ...updatedData, items: updatedData.items.map(i => ({ itemName: i.name, quantity: i.quantity })) }
                : inv
            ),
          };
        }
        return tenant;
      })
    );

    setEditModalVisible(false);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const handleItemChange = (index, field, value) => {
    const newItems = [...currentInventory.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === "quantity" ? parseInt(value) || 0 : value,
    };
    setCurrentInventory((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setCurrentInventory((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", condition: "", quantity: 0 }],
    }));
  };

  const handleRemoveItem = (index) => {
    if (currentInventory.items.length > 1) {
      setCurrentInventory((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const openDetailsModal = (inventory) => {
    setSelectedInventory(inventory);
    setDetailsModalVisible(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalVisible(false);
    setSelectedInventory(null);
  };

  const columns = [
  { label: "Tenant Name", key: "tenantName" },
  { label: "Phone", key: "phoneNumber" },
  { label: "Email", key: "tenantEmail" },
    {
      label: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex space-x-2">
          {/* <button
            onClick={() => openEditModal(row)}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400"
            disabled={loading}
          >
            Edit
          </button> */}
          {/* <button
            onClick={() => openDeleteModal(row)}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-700 text-white disabled:bg-gray-400"
            disabled={loading}
          >
            Delete
          </button> */}
          <button
            onClick={() => navigate(`/app/tenant-inventory/${row.phoneNumber}`)}
            className="bg-gray-400 text-white py-1 px-2 rounded"
            disabled={loading}
          >
            Details
          </button>
          <button
            onClick={() => navigate(`/app/see-tenant-items/${row.phoneNumber}`)}
            className="bg-gray-700 text-white py-1 px-2 rounded"
            disabled={loading}
          >
            Items
          </button>

        </div>
      ),
    },
  ];

  const handleAddClick = () => {
    window.location.href = "/app/add-in-out";
  };
  return (
    <div className="container mx-auto p-4">
      {loading && <LoadingComponent />}
      {error && !loading && (
        <div className="text-red-500 text-center">{error}</div>
      )}
      {!loading && !error && (
        <TableComponent
          title="Tenant Inventory List"
          data={inventoryData}
          columns={columns}
          exportable={true}
          showSearch={true}
          onAdd={handleAddClick}
        />
      )}

      {/* Edit Modal */}
      {editModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Inventory</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Inventory Type
                </label>
                <select
                  className="p-2 bg-base-100 w-full border border-gray-300 rounded-md"
                  value={currentInventory.type}
                  onChange={(e) =>
                    setCurrentInventory((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  required
                  disabled={loading}
                >
                  <option value="">Select Type</option>
                  <option value="move-in">Move-in</option>
                  <option value="move-out">Move-out</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  className="p-2 bg-base-100 w-full border border-gray-300 rounded-md"
                  value={currentInventory.notes}
                  onChange={(e) =>
                    setCurrentInventory((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows="3"
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Items</label>
                {currentInventory.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="p-2 bg-base-100 flex-1 border border-gray-300 rounded-md"
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      required
                      disabled={loading}
                    />
                    {/* <input
                      type="text"
                      className="p-2 bg-base-100 flex-1 border border-gray-300 rounded-md"
                      placeholder="Condition"
                      value={item.condition}
                      onChange={(e) =>
                        handleItemChange(index, "condition", e.target.value)
                      }
                      required
                      disabled={loading}
                    /> */}
                    <input
                      type="number"
                      className="p-2 bg-base-100 w-24 border border-gray-300 rounded-md"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      onWheel={(e)=> e.target.blur()}
                      min="1"
                      step="1"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                      disabled={currentInventory.items.length === 1 || loading}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-blue-500 text-white py-1 px-3 rounded-md mt-2 hover:bg-blue-600 disabled:bg-gray-400"
                  disabled={loading}
                >
                  Add Item
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{detailsModalVisible && selectedInventory && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-base-100 p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto relative">

      <h2 className="text-xl font-semibold mb-4">
        Inventories — {selectedInventory.tenantName}
      </h2>

      {/* Tenant info */}
      <div className="mb-4">
        <p><strong>Email:</strong> {selectedInventory.tenantEmail}</p>
        <p><strong>Phone:</strong> {selectedInventory.phoneNumber}</p>
      </div>

      {/* Inventories list */}
      {selectedInventory.inventories.map((inv, idx) => (
        <div key={idx} className="border rounded p-4 mb-4 relative">
          <h3 className="font-semibold mb-2">
            Inventory #{inv.inventoryId} ({inv.type})
          </h3>
          <p><strong>Floor:</strong> {inv.floorNumber}</p>
          <p><strong>Unit:</strong> {inv.unitNumber}</p>
          <p><strong>Notes:</strong> {inv.notes || "—"}</p>

          <h4 className="mt-2 font-medium">Items:</h4>
          <ul className="list-disc pl-5">
            {inv.items.map((item, i) => (
              <li key={i}>
                {item.itemName} — Qty: {item.quantity}
              </li>
            ))}
          </ul>

          {/* Edit button for this inventory */}
          <button
            className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            onClick={() => openEditModal(inv)}
          >
            Edit Inventory
          </button>
        </div>
      ))}

      {/* Nested Edit Modal */}
      {editModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <h2 className="text-xl font-semibold mb-4">Edit Inventory</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Inventory Type</label>
                <select
                  className="p-2 bg-base-100 w-full border border-gray-300 rounded-md"
                  value={currentInventory.type}
                  onChange={(e) =>
                    setCurrentInventory((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  required
                  disabled={loading}
                >
                  <option value="">Select Type</option>
                  <option value="move-in">Move-in</option>
                  <option value="move-out">Move-out</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  className="p-2 bg-base-100 w-full border border-gray-300 rounded-md"
                  value={currentInventory.notes}
                  onChange={(e) =>
                    setCurrentInventory((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows="3"
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Items</label>
                {currentInventory.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="p-2 bg-base-100 flex-1 border border-gray-300 rounded-md"
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      required
                      disabled={loading}
                    />
                    <input
                      type="number"
                      className="p-2 bg-base-100 w-24 border border-gray-300 rounded-md"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      onWheel={(e)=> e.target.blur()}
                      min="1"
                      step="1"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                      disabled={currentInventory.items.length === 1 || loading}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-blue-500 text-white py-1 px-3 rounded-md mt-2 hover:bg-blue-600 disabled:bg-gray-400"
                  disabled={loading}
                >
                  Add Item
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={closeDetailsModal}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
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
