import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../../components/Cards/TitleCard';
import Modal from '../../../components/Modal';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [unit, setUnit] = useState('Cans');
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [itemDetails, setItemDetails] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    axios
      .get('https://apartment.houseethiopia.com/api/item-types/')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        setError('Failed to fetch item categories. Please try again.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!itemName || !expirationDate || !itemAmount || !itemCategoryId || !itemDetails || !minAmount) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post('https://apartment.houseethiopia.com/api/items', {
        itemName,
        expirationDate,
        itemAmount,
        unit,
        itemCategoryId,
        itemDetails,
        min_amount: minAmount
      });
      
      // Reset form
      setItemName('');
      setExpirationDate('');
      setItemAmount(1);
      setUnit('Cans');
      setItemCategoryId('');
      setItemDetails('');
      setMinAmount(1);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Item created successfully');
      // window.location.href = '/item-view';
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
            <label htmlFor="itemCategoryId" className="block text-sm font-medium text-white-700">Item Category</label>
            <select
              id="itemCategoryId"
              value={itemCategoryId}
              onChange={(e) => setItemCategoryId(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
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

          <div className="mb-4">
            <label htmlFor="minAmount" className="block text-sm font-medium text-white-700">Minimum Amount</label>
            <input
              type="number"
              id="minAmount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              min="1"
              required
            />
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