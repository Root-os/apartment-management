import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../../../components/Modal';
import TitleCard from '../../../components/Cards/TitleCard';

const AddStockOutRequestPage = () => {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [source, setSource] = useState('store');
  const [reason, setReason] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}items`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to get Items!');
      }
    };
    fetchItems();
  }, []);

  const handleReasonChange = (e) => {
    const value = e.target.value;
    setReason(value);
    if (value.length < 10) {
      setValidationMessage('Reason must be at least 10 characters long.');
    } else {
      setValidationMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemId || !reason || !requestedQuantity) {
      setError('Please fill all fields.');
      return;
    }
    if (reason.length < 10) {
      setError('Reason must be at least 10 characters long.');
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        itemId: selectedItemId,
        source: source,
        reason: reason,
        requestedQuantity: requestedQuantity,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}stockout/request`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setModalOpen(true);
        setMessageType('success');
        setMessage('Stockout request added successfully');
      }
      setItems([]);
      setSource('store');
      setReason('');
      setRequestedQuantity('');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to Add stockout request!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title={'Add Stockout Request'}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block  text-white-700 font-semibold mb-2">Item</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full bg-base-100 p-2 border border-gray-300 rounded"
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
            <label className="block text-white-700 font-semibold mb-2">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-base-100 p-2 border border-gray-300 rounded"
            >
              <option value="store">Store</option>
              <option value="warehouse">Warehouse</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-white-700 font-semibold mb-2">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={handleReasonChange}
              className="w-full bg-base-100 p-2 border border-gray-300 rounded"
            />
            {validationMessage && <p className="text-red-500">{validationMessage}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-white-700 font-semibold mb-2">Requested Quantity</label>
            <input
              type="number"
              value={requestedQuantity}
              onChange={(e) => setRequestedQuantity(Number(e.target.value))}
              className="w-full bg-base-100 p-2 border border-gray-300 rounded"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Submit Request'}
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

export default AddStockOutRequestPage;