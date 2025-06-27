import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import Modal from "../../components/Modal";
import LoadingComponent from "../../components/loading";
import DeleteConfirmationModal from "../../components/editDeleteModal";
import { useNavigate } from "react-router-dom";


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
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}tenant-inventory`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "API request failed");
        }

        const formattedData = response.data.inventories.map((inventory) => ({
          id: inventory.id,
          tenantId: inventory.tenantId || null,
          tenantName: inventory.Tenant?.fullName || "N/A",
          tenantEmail: inventory.Tenant?.email || "N/A",
          tenantPhone: inventory.Tenant?.phoneNumber || "N/A",
          type: inventory.type || "N/A",
          checkedBy: inventory.checkedBy || "N/A",
          notes: inventory.notes || "",
          items: inventory.items || "[]",
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
    let items = [];
    try {
      items = Array.isArray(JSON.parse(inventory.items))
        ? JSON.parse(inventory.items)
        : [];
    } catch (e) {
      console.error("Failed to parse items:", e);
      items = [];
    }

    setCurrentInventory({
      id: inventory.id,
      tenantId: inventory.Tenant?.id || null,
      type: inventory.type || "",
      notes: inventory.notes || "",
      items: items.length ? items : [{ name: "", condition: "", quantity: 0 }],
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
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}tenant-inventory/${id}`,
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

    if (!token) {
      setModalOpen(true);
      setMessageType("error");
      setMessage("Authentication token missing");
      return;
    }

    // Check if all items are valid
    if (
      !currentInventory.items.length ||
      currentInventory.items.some(
        (item) => !item.name || !item.condition || item.quantity < 0
      )
    ) {
      setModalOpen(true);
      setMessageType("error");
      setMessage("All items must have a name, condition, and valid quantity!");
      return;
    }

    // Make sure items are properly formatted as an array
    const formattedItems = currentInventory.items.map((item) => ({
      name: item.name || "",
      condition: item.condition || "",
      quantity: item.quantity || 0,
    }));

    const updatedData = {
      tenantId: currentInventory.tenantId || undefined,
      type: currentInventory.type || undefined,
      items: formattedItems, // Ensure items are passed as an array
      notes: currentInventory.notes || undefined,
    };

    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}tenant-inventory/${currentInventory.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Update failed");
      }

      // Replace the entire inventory object after edit, making sure items are properly reflected as an array
      setInventoryData((prevData) =>
        prevData.map((item) =>
          item.id === currentInventory.id
            ? {
                ...item,
                ...updatedData,
                items: JSON.stringify(updatedData.items),
              } // Store items as a JSON string
            : item
        )
      );

      closeEditModal();
      setModalOpen(true);
      setMessageType("success");
      setMessage("Inventory updated successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update inventory";
      setModalOpen(true);
      setMessageType("error");
      setMessage(errorMessage);
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
    { label: "Inventory Type", key: "type" },
    // {
    //   label: 'Items',
    //   key: 'items',
    //   render: (row) => {
    //     let items = [];
    //     try {
    //       items = Array.isArray(JSON.parse(row.items)) ? JSON.parse(row.items) : [];
    //     } catch (e) {
    //       console.error('Failed to parse items:', e);
    //     }
    //     return (
    //       <ul className="list-disc pl-4">
    //         {items.map((item, index) => (
    //           <li key={index}>
    //             {item.name} (Condition: {item.condition}, Quantity: {item.quantity})
    //           </li>
    //         ))}
    //       </ul>
    //     );
    //   },
    // },
    { label: "Notes", key: "notes" },
    {
      label: "Actions",
      key: "actions",
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openEditModal(row)}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400"
            disabled={loading}
          >
            Edit
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-700 text-white disabled:bg-gray-400"
            disabled={loading}
          >
            Delete
          </button>
          <button
            onClick={() => openDetailsModal(row)} // Add this button
            className="bg-gray-400 text-white py-1 px-2 rounded"
            disabled={loading}
          >
            Details
          </button>
          <button
            onClick={() => navigate(`/app/see-tenant-items/${row.tenantId}`)}
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
                    <input
                      type="text"
                      className="p-2 bg-base-100 flex-1 border border-gray-300 rounded-md"
                      placeholder="Condition"
                      value={item.condition}
                      onChange={(e) =>
                        handleItemChange(index, "condition", e.target.value)
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
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Inventory Details</h2>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Tenant Information:</h3>
              <p>
                <strong>Name:</strong> {selectedInventory.tenantName}
              </p>
              <p>
                <strong>Email:</strong> {selectedInventory.tenantEmail}
              </p>
              <p>
                <strong>Phone:</strong> {selectedInventory.tenantPhone}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium">Inventory Info:</h3>
              <p>
                <strong>Type:</strong> {selectedInventory.type}
              </p>
              {/* <p><strong>Checked By:</strong> {selectedInventory.checkedBy}</p> */}
              <p>
                <strong>Notes:</strong> {selectedInventory.notes}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium">Items:</h3>
              <ul className="list-disc pl-4">
                {selectedInventory.items &&
                Array.isArray(JSON.parse(selectedInventory.items))
                  ? JSON.parse(selectedInventory.items).map((item, index) => (
                      <li key={index}>
                        {item.name} (Condition: {item.condition}, Quantity:{" "}
                        {item.quantity})
                      </li>
                    ))
                  : "No items available"}
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeDetailsModal}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
                disabled={loading}
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
