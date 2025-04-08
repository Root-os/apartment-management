import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddMaintenancePage = () => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [itemId, setItemId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isItem, setIsItem] = useState(false); // Track if the checkbox is checked
  const [name, setName] = useState(''); // Track the name if isItem is unchecked

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch items and units when the component mounts
  useEffect(() => {
    const fetchItemsAndUnits = async () => {
      try {
        const itemsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}items`);
        const unitsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}unit`);
        setItems(itemsResponse.data);
        setUnits(unitsResponse.data);
      } catch (err) {
        setModalOpen(true);
        setMessageType('error');
        setMessage('Error fetching items and units.');
      }
    };

    fetchItemsAndUnits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Start by preparing the payload with common fields
    const payload = {
      date,
      description,
      cost: parseFloat(cost),
      isItem,
      unitId: parseInt(unitId),
    };
  
    // When isItem is true, include itemId and exclude name
    if (isItem) {
      if (!itemId) {
        setModalOpen(true);
        setMessageType('error');
        setMessage('Please select a valid item.');
        setLoading(false);
        return;
      }
  
      payload.itemId = parseInt(itemId); // Add itemId to the payload
      delete payload.name; // Ensure name is excluded when isItem is true
    } else {
      if (!name) {
        setModalOpen(true);
        setMessageType('error');
        setMessage('Please provide a name for the maintenance.');
        setLoading(false);
        return;
      }
  
      delete payload.itemId; // Ensure itemId is excluded when isItem is false
      payload.name = name; // Add name to the payload
    }
  
    try {
      // Send the request to the API
      await axios.post(`${process.env.REACT_APP_BASE_URL}maintenance`, payload);
  
      // Reset the form
      setDate('');
      setDescription('');
      setCost('');
      setItemId('');
      setUnitId('');
      setName('');
      setIsItem(false);
  
      setModalOpen(true);
      setMessageType('success');
      setMessage('Maintenance data added successfully!');
      window.location.href = '/app/view-maintenance';
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add Maintenance data!');
      console.error('Error adding maintenance data:', err.response ? err.response.data : err);
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <>
      <TitleCard title="Add Maintenance" topMargin={'mt-2'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Is Item Checkbox */}
          <div>
            <label htmlFor="isItem" className="inline-flex items-center">
              <input
                type="checkbox"
                id="isItem"
                checked={isItem}
                onChange={(e) => setIsItem(e.target.checked)} // Toggle isItem state
                className="mr-2"
              />
              Is Item?
            </label>
          </div>

          {/* Item Select (Only visible if isItem is true) */}
          <div>
            <label htmlFor="itemId" className="block text-sm font-medium text-white-700">
              Item
            </label>
            <select
              id="itemId"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-base-100"
              disabled={!isItem} // Disable if not an item
              required={isItem} // Make required if isItem is checked
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.itemName}
                </option>
              ))}
            </select>
          </div>

          {/* Name Input (Only visible if isItem is false) */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-base-100"
              disabled={isItem} // Disable if it's an item
              required={!isItem} // Make required if it's not an item
            />
          </div>

          {/* Unit Select */}
          <div>
            <label htmlFor="unitId" className="block text-sm font-medium text-white-700">
              Unit
            </label>
            <select
              id="unitId"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-base-100"
              required
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unitNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-base-100"
              required
            />
          </div>

          {/* Date Input */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-white-700">
              Maintenance Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-base-100"
              required
            />
          </div>

          {/* Cost Input */}
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-white-700">
             Maintenance Cost
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              id="cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-base-100"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Maintenance'}
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

export default AddMaintenancePage;
