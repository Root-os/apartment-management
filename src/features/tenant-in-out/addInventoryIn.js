import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from '../../components/Modal';
import TitleCard from '../../components/Cards/TitleCard';

const InventoryForm = () => {
  const [tenantId, setTenantId] = useState(null);
  const [tenants, setTenants] = useState([]); // State to store all tenants
  const [type, setType] = useState("move-in");
  const [items, setItems] = useState([{ name: "", condition: "", quantity: 1 }]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setmessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch all tenants once the component is mounted
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('https://apartment.houseethiopia.com/api/tenant');
        setTenants(response.data); // Assuming the API returns an array of tenants
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    fetchTenants();
  }, []);

  // Handle tenant selection from the dropdown
  const handleTenantChange = (event) => {
    setTenantId(event.target.value);
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emptyItem = items.some(item => !item.name || !item.condition || item.quantity <= 0);
    if (emptyItem) {
      setMessage("Please fill out all fields for each item.");
      return;
    }
    const payload = {
      tenantId,
      type,
      items,
      notes
    };
    const token = localStorage.getItem('token'); 

    if (!token) {
      setMessage("No authentication token found. Please log in.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}tenant-inventory`,
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        setModalOpen(true);
        setmessageType('success');
        setMessage('Inventory data created successfully!');
        window.location.href='/app/view-in-out';
      } else {
        setMessage("Failed to create inventory data.");
      }
    } catch (error) {
      console.error("Error:", error.response || error);
      setMessage("Failed to create inventory data. Please try again.");

      setModalOpen(true);
      setmessageType('error');
      setMessage('Unable to add the data!');
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
    setItems([...items, { name: "", condition: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <>
      <TitleCard title={'Add In/Out data'} topMargin={'mt-1'}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tenantId" className="block text-sm font-medium">Tenant</label>
            <select
              id="tenantId"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
              value={tenantId || ""}
              onChange={handleTenantChange}
            >
              <option value="">Select a Tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium">Type</label>
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
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                />
                <input
                  type="text"
                  className="p-2 w-full border border-gray-300 rounded-md bg-base-100"
                  placeholder="Condition"
                  value={item.condition}
                  onChange={(e) => handleItemChange(index, "condition", e.target.value)}
                />
                <input
                  type="number"
                  className="p-2 w-full border border-gray-300 rounded-md bg-base-100"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
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
            <label htmlFor="notes" className="block text-sm font-medium">Notes</label>
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
            {loading ? 'Submitting...' : 'Add Data'}
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
