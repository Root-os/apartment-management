import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const ReturnsPage = () => {
  const [returns, setReturns] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorId, setVendorId] = useState('');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}returns`)
      .then((response) => {
        setReturns(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the returns:', error);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}vendors`)
      .then((response) => {
        setVendors(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the vendors:', error);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}items`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the items:', error);
      });
  }, []);

  // Handle edit button click
  const handleEditClick = (returnItem) => {
    setSelectedReturn(returnItem);
    setVendorId(returnItem.vendorId);
    setItemId(returnItem.itemId);
    setQuantity(returnItem.quantity);
    setReason(returnItem.reason);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (returnItem) => {
    setSelectedReturn(returnItem);
    setIsDeleteModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);

    try {
      const updatedReturn = {
        vendorId,
        itemId,
        quantity,
        reason
      };

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}returns/${selectedReturn.id}`, updatedReturn);
      const updatedData = returns.map((returnItem) =>
        returnItem.id === selectedReturn.id ? response.data : returnItem
      );
      setReturns(updatedData);
      setIsEditModalOpen(false);
      setSelectedReturn(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Return updated successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update return');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}returns/${selectedReturn.id}`);
      setReturns(returns.filter((returnItem) => returnItem.id !== selectedReturn.id));
      setIsDeleteModalOpen(false);
      setSelectedReturn(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Return deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete return');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'Vendor.fname', label: 'Vendor', render: (row) => `${row.Vendor?.fname} ${row.Vendor?.lname}` },
    { key: 'Item.itemName', label: 'Item',render: (row) => row.Item?.itemName },
    { key: 'quantity', label: 'Quantity' },
    { key: 'reason', label: 'Reason' },
    { key: 'returnDate', label: 'Return Date',render: (row) => new Date(row.returnDate).toLocaleString() },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <>
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Returns</h1>
      <TableComponent
        title="Returns List"
        data={returns}
        columns={columns}
        exportable={true}
        showSearch={true}
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-full max-w-lg mx-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
            <h2 className="text-2xl font-bold mb-4">Edit Return</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="vendorId" className="block text-sm font-medium text-white-700">
                  Vendor
                </label>
                <select
                  id="vendorId"
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>{vendor.fname} {vendor.lname}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="itemId" className="block text-sm font-medium text-white-700">
                  Item
                </label>
                <select
                  id="itemId"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Item</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>{item.itemName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-white-700">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-medium text-white-700">
                  Reason
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl mb-4">Are you sure you want to delete this return?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default ReturnsPage;