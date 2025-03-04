import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../../components/Cards/TitleCard'
import Modal from '../../../components/Modal';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [itemAmount, setItemAmount] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [itemCategory, setItemCategory] = useState('');
  const [itemDetails, setItemDetails] = useState('');
  const [itemTypes, setItemTypes] = useState([]);
  const [itemTypeId, setItemTypeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  

  
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}item-types`)
      .then((response) => {
        setItemTypes(response.data);
      })
      .catch((err) => {
        setError('Failed to fetch item types. Please try again.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!itemName || !expirationDate || !itemAmount || !itemTypeId || !itemCategory || !itemDetails) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}items`, {
        itemName,
        expirationDate,
        itemAmount,
        itemTypeId,
        unit,
        itemCategory,
        itemDetails
      });
      setItemName('');
      setExpirationDate('');
      setItemAmount(1);
      setUnit('pcs');
      setItemCategory('');
      setItemDetails('');
      setItemTypeId('');

      setModalOpen(true);
      setMessageType('success');
      setMessage('Item added successfully.');
      window.location.href = '/item-view'
    } catch (error) {
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
 <>
    <TitleCard title="Add Item">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="itemName" className="block text-sm font-medium text-white-700">Item Name</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            placeholder="Enter item name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="expirationDate" className="block text-sm font-medium text-white-700">Expiration Date</label>
          <input
            type="date"
            id="expirationDate"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="itemAmount" className="block text-sm font-medium text-white-700">Amount</label>
          <input
            type="number"
            id="itemAmount"
            value={itemAmount}
            onChange={(e) => setItemAmount(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            min="1"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="itemTypeId" className="block text-sm font-medium text-white-700">Item Type</label>
          <select
            id="itemTypeId"
            value={itemTypeId}
            onChange={(e) => setItemTypeId(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
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

        <div className="mb-4">
          <label htmlFor="unit" className="block text-sm font-medium text-white-700">Unit</label>
          <input
            type="text"
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            placeholder="Enter unit"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="itemCategory" className="block text-sm font-medium text-white-700">Item Category</label>
          <input
            type="text"
            id="itemCategory"
            value={itemCategory}
            onChange={(e) => setItemCategory(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            placeholder="Enter item category"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="itemDetails" className="block text-sm font-medium text-white-700">Item Details</label>
          <textarea
            id="itemDetails"
            value={itemDetails}
            onChange={(e) => setItemDetails(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            placeholder="Enter item details"
            required
          ></textarea>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
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

export default AddItem;
