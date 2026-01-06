import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingComponent from "../../components/loading";
import Modal from "../../components/Modal";
import DeleteConfirmationModal from "../../components/editDeleteModal";

const TenantInventoryDetailsPage = () => {
  const { phoneNumber } = useParams();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentInventory, setCurrentInventory] = useState({
    id: null,
    tenantId: null,
    type: "",
    notes: "",
    items: [],
  });

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`tenant-inventory/phone/${phoneNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
       if (!res.data.success) {
        setTenant(null);
        setMessage(res.data.message);
        return;
        }

        setTenant(res.data.tenant);

      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch tenant inventory");
        setMessageType("error");
        setModalOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [phoneNumber]);

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
    setCurrentInventory({ id: null, tenantId: null, type: "", notes: "", items: [] });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...currentInventory.items];
    newItems[index] = { ...newItems[index], [field]: field === "quantity" ? parseInt(value) || 0 : value };
    setCurrentInventory((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setCurrentInventory((prev) => ({ ...prev, items: [...prev.items, { name: "", quantity: 0 }] }));
  };

  const handleRemoveItem = (index) => {
    if (currentInventory.items.length > 1) {
      setCurrentInventory((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        type: currentInventory.type,
        notes: currentInventory.notes,
        items: currentInventory.items.map((item) => ({ name: item.name, quantity: item.quantity })),
      };

      await api.put(`tenant-inventory/${currentInventory.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTenant((prev) => ({
        ...prev,
        units: prev.units.map((inv) =>
          inv.inventoryId === currentInventory.id
            ? {
                ...inv,
                ...updatedData,
                items: updatedData.items.map((i) => ({ itemName: i.name, quantity: i.quantity })),
              }
            : inv
        ),
      }));

      setMessage("Inventory updated successfully!");
      setMessageType("success");
      setModalOpen(true);

      closeEditModal();
    } catch (err) {
      console.error(err);
      setMessage("Failed to update inventory");
      setMessageType("error");
      setModalOpen(true);
    }
  };

  const openDeleteModal = (inventory) => {
    setInventoryToDelete(inventory);
    setDeleteModalVisible(true);
  };

  const handleDelete = async (inventoryId) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`tenant-inventory/${inventoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTenant((prev) => ({
        ...prev,
        units: prev.units.filter((inv) => inv.inventoryId !== inventoryId),
      }));

      setDeleteModalVisible(false);
      setMessage("Inventory deleted successfully!");
      setMessageType("success");
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setDeleteModalVisible(false);
      setMessage("Failed to delete inventory");
      setMessageType("error");
      setModalOpen(true);
    }
  };

  if (loading) return <LoadingComponent />;
   if (!tenant) {
    return (
        <div className="container mx-auto p-6">
        <button
            onClick={() => navigate(-1)}
            className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold"
        >
            ← Back
        </button>

        {message && (
            <div className="rounded-md bg-blue-50 border border-blue-200 p-4 text-blue-700">
            {message}
            </div>
        )}
        </div>
    );
    }

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold"
      >
        ← Back
      </button>

      {message && (
        <div className="mb-6 rounded-md bg-blue-50 border border-blue-200 p-4 text-blue-700">
            {message}
        </div>
        )}


      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{tenant.fullName}</h1>
        <p className="text-gray-700">Email: {tenant.email}</p>
        <p className="text-gray-700">Phone: {tenant.phoneNumber}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tenant.units.map((inv) => (
          <div key={inv.inventoryId} className="bg-white shadow-md rounded-lg p-5 border border-gray-200 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Inventory  ({inv.type})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(inv)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg font-medium transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(inv)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-1"><strong>Floor:</strong> {inv.floorNumber}</p>
            <p className="text-gray-600 mb-1"><strong>Unit:</strong> {inv.unitNumber}</p>
            <p className="text-gray-600 mb-3"><strong>Notes:</strong> {inv.notes || "—"}</p>

            <h3 className="font-semibold mb-2 text-gray-800">Items:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {inv.items.map((item, i) => (
                <li key={i} className="text-gray-700">
                  {item.itemName} — Qty: {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Inventory</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Inventory type */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Inventory Type</label>
                <select
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                  value={currentInventory.type}
                  onChange={(e) => setCurrentInventory((prev) => ({ ...prev, type: e.target.value }))}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="move-in">Move-in</option>
                  <option value="move-out">Move-out</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Notes</label>
                <textarea
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                  value={currentInventory.notes}
                  onChange={(e) => setCurrentInventory((prev) => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                />
              </div>

              {/* Items */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Items</label>
                {currentInventory.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 p-2 border rounded-md"
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, "name", e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      className="w-24 p-2 border rounded-md"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      min="1"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 font-medium"
                      disabled={currentInventory.items.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md font-medium"
                >
                  Add Item
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium"
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
        isOpen={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onDelete={() => handleDelete(inventoryToDelete.inventoryId)}
        data={inventoryToDelete}
      />

      {/* Success/Error Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={message}
        messageType={messageType}
      />
    </div>
  );
};

export default TenantInventoryDetailsPage;
