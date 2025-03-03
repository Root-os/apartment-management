import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';
import TitleCard from '../../components/Cards/TitleCard';

const ItemAssignmentForm = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    itemId: '',
    assignDate: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Get the userId (assignedId) from localStorage
  const assignedId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}items`);
        setItems(response.data);
      } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to get items');
      }
    };

    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignedId) {
      setError('User not found');
      return;
    }

    const payload = {
      itemId: formData.itemId,
      assignedId: assignedId, 
      assignType: 'User',
      assignDate: formData.assignDate,
      amount: formData.amount,
      description: formData.description,
    };

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}item-assignments`, payload);
      setFormData({
        itemId: '',
        assignDate: '',
        amount: '',
        description: ''
      });
      setModalOpen(true);
      setMessageType('success');
      setMessage('Item assignment Added successfully!')
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add Item assignment!')
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Add Item Assignment" topMargin={'mt-2'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-white-700">Item</label>
          <select
            name="itemId"
            value={formData.itemId}
            onChange={handleChange}
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
          <label className="block text-sm font-medium text-white-700">Assign Date</label>
          <input
            type="date"
            name="assignDate"
            value={formData.assignDate}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-base-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="bg-base-100 mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
            rows="4"
          />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 w-full"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Assignment'}
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

export default ItemAssignmentForm;
