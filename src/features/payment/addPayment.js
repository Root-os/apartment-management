import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const PaymentAdd = () => {
  const [vendorId, setVendorId] = useState('');
  const [itemId, setItemId] = useState('');
  const [price, setPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [status, setStatus] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [description, setDescription] = useState('');
  const [item, setItem] = useState('');

  const [vendors, setVendors] = useState([]);
  const [vendorPurchases, setVendorPurchases] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}vendors`)
      .then((res) => setVendors(res.data))
      .catch((err) => console.error('Error fetching vendors:', err));
  }, []);

  // When vendor changes, fetch purchases
  useEffect(() => {
    if (!vendorId) return;

    axios
      .get(`${process.env.REACT_APP_BASE_URL}purchases`)
      .then((res) => {
        const purchasesForVendor = res.data.filter(p => p.vendorId === parseInt(vendorId));
        setVendorPurchases(purchasesForVendor);
      })
      .catch((err) => console.error('Error fetching purchases:', err));
  }, [vendorId]);

  // When item changes, set itemName, description, and price
  useEffect(() => {
    if (!itemId || vendorPurchases.length === 0) return;

    const selectedPurchase = vendorPurchases.find(p => p.itemId === parseInt(itemId));
    if (selectedPurchase) {
      setItem(selectedPurchase.Item?.itemName || '');
      setDescription(selectedPurchase.description || '');
      setPrice(selectedPurchase.totalPrice || '');
    }
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!vendorId || !price || !paymentMethod || !status || !paymentDate) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}payments`, {
        vendorId,
        item,
        description,
        price,
        paymentMethod,
        status,
        paymentDate,
      });

      setVendorId('');
      setItemId('');
      setItem('');
      setDescription('');
      setPrice('');
      setPaymentMethod('');
      setStatus('');
      setPaymentDate('');

      setModalOpen(true);
      setMessageType('success');
      setMessage('Payment added successfully.');
      window.location.href = '/app/view-payments';
    } catch (err) {
      const resMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      setModalOpen(true);
      setMessageType('error');
      setMessage(resMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Add Payment for Vendor" topMargin="mt-1">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="vendorId" className="block text-sm font-medium text-white-700">Vendor</label>
            <select
              id="vendorId"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="" disabled>Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.fname} {vendor.lname}
                </option>
              ))}
            </select>
          </div>

          {vendorPurchases.length > 0 && (
            <div className="mb-4">
              <label htmlFor="itemId" className="block text-sm font-medium text-white-700">Item</label>
              <select
                id="itemId"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
                required
              >
                <option value="" disabled>Select Item</option>
                {vendorPurchases.map((purchase) => (
                  <option key={purchase.id} value={purchase.itemId}>
                    {purchase.Item?.itemName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-white-700">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-white-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-white-700">Payment Method</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="" disabled>Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="credit">Credit</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-white-700">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="" disabled>Select Status</option>
              <option value="complete">Complete</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="paymentDate" className="block text-sm font-medium text-white-700">Payment Date</label>
            <input
              type="date"
              id="paymentDate"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 w-full"
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

export default PaymentAdd;
