import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard'
import Modal from '../../components/Modal'

const AddMaintenancePage = () => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [itemId, setItemId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

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
        setMessage('Error fetching items and units.')
      }
    };

    fetchItemsAndUnits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   

    const payload = {
      date,
      description,
      cost: parseFloat(cost),
      itemId: parseInt(itemId),
      unitId: parseInt(unitId),
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}maintenance`, payload);
      // Reset the form
      setDate('');
      setDescription('');
      setCost('');
      setItemId('');
      setUnitId('');

      setModalOpen(true);
      setMessageType('success');
      setMessage('Maintenance data Added successfully!')
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add Maintenance data!')
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Add Maintenance" topMargin={'mt-2'}>
      <form onSubmit={handleSubmit} className="space-y-6">
             {/* Item Select */}
        <div>
          <label htmlFor="itemId" className="block text-sm font-medium text-white-700">Item</label>
          <select
            id="itemId"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-base-100"
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
        {/* Unit Select */}
        <div>
          <label htmlFor="unitId" className="block text-sm font-medium text-white-700">Unit</label>
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
          <label htmlFor="description" className="block text-sm font-medium text-white-700">Description</label>
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
          <label htmlFor="date" className="block text-sm font-medium text-white-700">Date</label>
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
          <label htmlFor="cost" className="block text-sm font-medium text-white-700">Cost</label>
          <input
            type="number"
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
       onClose={()=> setModalOpen(false)}
       messageType={messageType}
       message={message}
      />
    </>
  );
};

export default AddMaintenancePage;
