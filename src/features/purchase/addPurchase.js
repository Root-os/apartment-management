import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from '../../components/Cards/TitleCard'
import Modal from '../../components/Modal';

const AddPurchaseForm = () => {
  // State to store form fields and API data
  const [vendourName, setVendourName] = useState("");
  const [vendourPhone, setVendourPhone] = useState("");
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [itemId, setItemId] = useState("");
  const [itemTypeId, setItemTypeId] = useState("");

  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch items and item types
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("https://apartment.houseethiopia.com/api/items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items", error);
      }
    };

    const fetchItemTypes = async () => {
      try {
        const response = await axios.get("https://apartment.houseethiopia.com/api/item-types/");
        setItemTypes(response.data);
      } catch (error) {
        console.error("Error fetching item types", error);
      }
    };

    fetchItems();
    fetchItemTypes();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const purchaseData = {
      vendourName,
      vendourPhone,
      amount,
      price,
      description,
      expirationDate,
      itemId,
      itemTypeId,
    };

    try {
     setLoading(true);

      const response = await axios.post("https://apartment.houseethiopia.com/api/purchases", purchaseData);
      console.log("Purchase added successfully", response.data);
      // Reset form
      setVendourName("");
      setVendourPhone("");
      setAmount(0);
      setPrice(0);
      setDescription("");
      setExpirationDate("");
      setItemId("");
      setItemTypeId("");

      setModalOpen(true);
      setMessageType('success');
      setMessage('purchase added succefuly')
    } catch (error) {
      console.error("Error adding purchase", error);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add purchase data')
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title={'Add Purchase'}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white-700">Vendor Name</label>
          <input
            type="text"
            value={vendourName}
            onChange={(e) => setVendourName(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white-700">Vendor Phone</label>
          <input
            type="text"
            value={vendourPhone}
            onChange={(e) => setVendourPhone(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white-700">Expiration Date</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white-700">Item</label>
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
            required
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.itemName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white-700">Item Type</label>
          <select
            value={itemTypeId}
            onChange={(e) => setItemTypeId(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
            required
          >
            <option value="">Select Item Type</option>
            {itemTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.typeName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Submitting' : 'Add Purchase'}
        </button>
      </form>
      </TitleCard>
      <Modal
        isOpen={modalOpen}
        onClose={()=> setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </>
  );
};

export default AddPurchaseForm;
