import React, { useEffect, useState } from "react";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import Modal from "../../components/Modal";
import api from "../../utils/api";

const ItemOutRequestForm = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ tenantItemId: "", name: "", quantity: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [units, setUnits] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState('');

  useEffect(() => {
  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`dashboard/for-tenant`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedUnits = response.data.unitsOccupied || [];
      setUnits(fetchedUnits);

      // Auto-select if only one unit
      if (fetchedUnits.length === 1) {
        setSelectedTenantId(fetchedUnits[0].tenantId);
      }
    } catch (err) {
      console.error("Error fetching units:", err);
    }
  };
  fetchUnits();
}, []);

useEffect(() => {
  const fetchTenantItems = async () => {
    if (!selectedTenantId) {
      setItems([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.get(
        `tenant-items/${selectedTenantId}/items`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching tenant items:", error);
      setItems([]);
    }
  };

  fetchTenantItems();
}, [selectedTenantId]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setMessage("");
    setModalOpen(false);

    const data = {
      quantity: parseInt(form.quantity),
      tenantId: selectedTenantId ? parseInt(selectedTenantId) : undefined,
    };

    if (form.tenantItemId) {
      data.tenantItemId = parseInt(form.tenantItemId);
    } else if (form.name) {
      data.name = form.name;
    }

    try {
      const response = await api.post(
        `item-out-request`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Request sent for ${response.data.item?.itemName || response.data.name}`);
      setMessageType("success");
      setForm({ tenantItemId: "", name: "", quantity: 1 });
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to submit item request.";
      setMessage(errorMsg);
      setMessageType("error");
    } finally {
      setIsLoading(false);
      setModalOpen(true);
    }
  };

  return (
    <>
      <TitleCard title="Send Item Out Request" topMargin="mt-2">
        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Select Unit</label>
              <select
                value={selectedTenantId}
                onChange={(e) => {
                  setSelectedTenantId(e.target.value);
                  setItems([]);
                  setForm({ tenantItemId: "", name: "", quantity: 1 });
                }}
                className="w-full border rounded-lg p-2 bg-base-100"
              >
                <option value="">-- Select a unit --</option>
                {units.map((u) => (
                  <option key={u.tenantId} value={u.tenantId}>
                    Unit {u.unitNumber} (Floor {u.floorNumber})
                  </option>
                ))}
              </select>
          </div>
          {/* Dropdown for existing item */}
          {selectedTenantId && (
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Select Existing Item</label>
              <select
                name="tenantItemId"
                value={form.tenantItemId}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value) setForm((prev) => ({ ...prev, name: "" }));
                }}
                className="w-full border rounded-lg p-2 bg-base-100"
              >
                <option value="">-- None --</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.itemName} (Qty: {item.quantity})
                  </option>
                ))}
              </select>
            </div>
          )}


          {/* New Item Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Or Enter New Item Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value) setForm((prev) => ({ ...prev, tenantItemId: "" }));
              }}
              className="w-full border rounded-lg p-2 bg-base-100"
              placeholder="e.g. Projector"
              disabled={!!form.tenantItemId}
            />
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 bg-base-100"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-full px-6 py-2 text-white font-semibold rounded-lg focus:outline-none ${
                isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </TitleCard>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </>
  );
};

export default ItemOutRequestForm;
