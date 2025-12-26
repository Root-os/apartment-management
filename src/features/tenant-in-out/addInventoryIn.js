import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/Modal";
import TitleCard from "../../components/Cards/TitleCard";
import { useSearchParams } from "react-router-dom";
import api from '../../utils/api';

const InventoryForm = () => {
 const [profiles, setProfiles] = useState([]);
const [selectedProfileIndex, setSelectedProfileIndex] = useState("");
const [selectedTenantId, setSelectedTenantId] = useState("");


  const [searchParams] = useSearchParams();

  const [type, setType] = useState("move-in");
  const [items, setItems] = useState([
    { name: "",  quantity: 1 },
  ]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setmessageType] = useState("success");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  // Fetch all tenants once the component is mounted
useEffect(() => {
  const fetchProfiles = async () => {
    try {
      const res = await api.get(
        `tenant/floor-units`
      );
      setProfiles(res.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  fetchProfiles();
}, []);


useEffect(() => {
  const tenantIdFromUrl = searchParams.get("tenantId");
  if (!tenantIdFromUrl || profiles.length === 0) return;

  profiles.forEach((profile, profileIndex) => {
    const matchedTenant = profile.tenant.find(
      (t) => t.tenantId === Number(tenantIdFromUrl)
    );

    if (matchedTenant) {
      setSelectedProfileIndex(profileIndex);
      setSelectedTenantId(matchedTenant.tenantId);
    }
  });
}, [searchParams, profiles]);

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTenantId) {
      setMessage("Please select a tenant and unit.");
      setmessageType("error");
      setModalOpen(true);
      return;
    }

    const emptyItem = items.some(
      (item) => !item.name ||  item.quantity <= 0
    );
    if (emptyItem) {
      setMessage("Please fill out all fields for each item.");
      setmessageType("error");
      setModalOpen(true);
      return;
    }

    const payload = {
      tenantId: Number(selectedTenantId),
      type,
      items,
      notes,
    };

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("No authentication token found. Please log in.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        `tenant-inventory`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setModalOpen(true);
        setmessageType("success");
        setMessage("Inventory data created successfully!");
        // window.location.href = "/app/view-in-out";
        setTimeout(() => {
        navigate("/app/view-in-out");
      }, 1500);
      } else {
        setMessage("Failed to create inventory data.");
      }
    } catch (error) {
      console.error("Error:", error.response || error);
      setMessage("Failed to create inventory data. Please try again.");

      setModalOpen(true);
      setmessageType("error");
      setMessage("Unable to add the data!");
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "",  quantity: 1 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <>
      <TitleCard title={"Add In/Out data"} topMargin={"mt-1"}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Tenant</label>
<select
  className="mt-1 p-2 w-full border rounded bg-base-100"
  value={selectedProfileIndex}
  onChange={(e) => {
    setSelectedProfileIndex(e.target.value);
    setSelectedTenantId(""); // reset unit
  }}
>
  <option value="">Select Tenant</option>
  {profiles.map((profile, index) => (
    <option key={profile.phoneNumber} value={index}>
      {profile.fullName} ({profile.phoneNumber})
    </option>
  ))}
</select>

          </div>

          {selectedProfileIndex !== "" && (
  <>
    <label className="block text-sm font-medium mt-4">Unit</label>
    <select
      className="mt-1 p-2 w-full border rounded bg-base-100"
      value={selectedTenantId}
      onChange={(e) => setSelectedTenantId(e.target.value)}
    >
      <option value="">Select Unit</option>
      {profiles[selectedProfileIndex].tenant.map((t) => (
        <option key={t.tenantId} value={t.tenantId}>
          Unit {t.unit.unitNumber} – Floor {t.floor.floorNumber}
        </option>
      ))}
    </select>
  </>
)}


          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium">
              Type
            </label>
            <select
              id="type"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="move-in">Move-in</option>
              <option value="move-out">Move-out</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Items</label>
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                <input
                  type="text"
                  className="p-2 w-full border border-gray-300 rounded-md bg-base-100"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                />
                {/* <input
                  type="text"
                  className="p-2 w-full border border-gray-300 rounded-md bg-base-100"
                  placeholder="Condition"
                  value={item.condition}
                  onChange={(e) =>
                    handleItemChange(index, "condition", e.target.value)
                  }
                /> */}
                <input
                  type="number"
                  className="p-2 w-full border border-gray-300 rounded-md bg-base-100"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                      handleItemChange(index, "quantity", Number(e.target.value))
                    }
                  onWheel={(e)=> e.target.blur()}
                  min="1"
                  step="1"
                />
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={addItem}
            >
              Add Item
            </button>
          </div>

          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium">
              Notes
            </label>
            <textarea
              id="notes"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add Data"}
          </button>
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

export default InventoryForm;
