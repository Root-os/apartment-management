import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import Modal from '../../components/Modal'; 

const TenantOrderPage = () => {
  const [orderTypes, setOrderTypes] = useState([]);
  const [selectedOrderType, setSelectedOrderType] = useState(null);
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDate, setOrderDate] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptImage, setReceiptImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}order-type`)
      .then((response) => {
        setOrderTypes(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the order types:', error);
      })
      .finally(() => { setIsLoading(false); });
  }, []);

  // Handle order button click
  const handleOrderClick = (orderType) => {
    setSelectedOrderType(orderType);
    setIsCreateOrderModalOpen(true);
  };

  const handleFileChange = (e) => {
    setReceiptImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOrderType) {
      setMessageType('error');
      setMessage('Order type ID is missing.');
      setModalOpen(true);
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('orderDate', orderDate);
    formData.append('amount', amount);
    formData.append('notes', notes);
    formData.append('orderTypeId', selectedOrderType.id);
    formData.append('receiptImage', receiptImage);

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}order`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessageType('success');
      setMessage('Order created successfully.');
      setIsCreateOrderModalOpen(false);
    } catch (error) {
      setMessageType('error');
      setMessage('Unable to create order.');
    } finally {
      setLoading(false);
      setModalOpen(true); // Open the modal after order submission attempt
    }
  };

  const columns = [
    { key: 'name', label: 'Order Name' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price (ETB)' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() => handleOrderClick(row)}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Order
        </button>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (<LoadingComponent />) : (
        <TableComponent
          title="Order Types List"
          data={orderTypes}
          columns={columns}
          exportable={true}
          showSearch={true}
        />
      )}
      {/* Create Order Modal */}
      {isCreateOrderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">Create Order</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="orderDate" className="block text-sm font-medium text-white-700">
                  Order Date
                </label>
                <input
                  type="date"
                  id="orderDate"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-white-700">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  min="0"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-white-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="receiptImage" className="block text-sm font-medium text-white-700">
                  Receipt Image
                </label>
                <input
                  type="file"
                  id="receiptImage"
                  onChange={handleFileChange}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateOrderModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal to display success or error messages */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default TenantOrderPage;
