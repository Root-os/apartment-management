import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table';
import Modal from '../../../components/Modal';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [unit, setUnit] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemDetails, setItemDetails] = useState('');
  const [itemTypeId, setItemTypeId] = useState('');
  const [itemTypes, setItemTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch items from the API
    axios
      .get(`${process.env.REACT_APP_BASE_URL}items`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the items:', error);
      });

    // Fetch item types from the API
    axios
      .get(`${process.env.REACT_APP_BASE_URL}Item-types`)
      .then((response) => {
        setItemTypes(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the item types:', error);
      });
  }, []);

  // Handle edit button click
  const handleEditClick = (item) => {
    setSelectedItem(item);
    setItemName(item.itemName);
    setExpirationDate(new Date(item.expirationDate).toISOString().split('T')[0]); // Convert date to YYYY-MM-DD format
    setItemAmount(item.itemAmount);
    setUnit(item.unit);
    setItemCategory(item.itemCategory);
    setItemDetails(item.itemDetails);
    setItemTypeId(item.itemTypeId);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedItem = {
        itemName,
        expirationDate,
        itemAmount,
        unit,
        itemCategory,
        itemDetails,
        itemTypeId,
      };

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}items/${selectedItem.id}`, updatedItem);
      const updatedData = items.map((item) =>
        item.id === selectedItem.id ? response.data : item
      );
      setItems(updatedData);
      setIsEditModalOpen(false);
      setSelectedItem(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Item updated successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update item');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}items/${selectedItem.id}`);
      setItems(items.filter((item) => item.id !== selectedItem.id));
      setIsDeleteModalOpen(false);
      setSelectedItem(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Item deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete item');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'itemName', label: 'Item Name' },
    {
      key: 'expirationDate',
      label: 'Expiration Date',
      render: (row) => new Date(row.expirationDate).toLocaleString(), 
    },
    {
      key: 'itemAmount',
      label: 'Item Amount',
      render: (row) => row.itemAmount, 
    },
    { key: 'unit', label: 'Unit' },
    { key: 'itemCategory', label: 'Item Category' },
    { key: 'itemDetails', label: 'Item Details' },
    {
      key: 'itemTypeId',
      label: 'Item Type',
      render: (row) => {
        const itemType = itemTypes.find((type) => type.id === row.itemTypeId);
        return itemType ? itemType.typeName : 'Unknown';
      },
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex justify-end space-x-2">
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
        </div>
      ),
    },
  ];

  return (
    <div>

      <TableComponent
        title="Items List"
        data={items}
        columns={columns}
        exportable={true}
        showSearch={true}
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
          <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="itemName" className="block text-sm font-medium text-white-700">
                  Item Name
                </label>
                <input
                  type="text"
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="expirationDate" className="block text-sm font-medium text-white-700">
                  Expiration Date
                </label>
                <input
                  type="date"
                  id="expirationDate"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="itemAmount" className="block text-sm font-medium text-white-700">
                  Item Amount
                </label>
                <input
                  type="number"
                  id="itemAmount"
                  value={itemAmount}
                  onChange={(e) => setItemAmount(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="unit" className="block text-sm font-medium text-white-700">
                  Unit
                </label>
                <input
                  type="text"
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="itemCategory" className="block text-sm font-medium text-white-700">
                  Item Category
                </label>
                <input
                  type="text"
                  id="itemCategory"
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="itemDetails" className="block text-sm font-medium text-white-700">
                  Item Details
                </label>
                <textarea
                  id="itemDetails"
                  value={itemDetails}
                  onChange={(e) => setItemDetails(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="itemTypeId" className="block text-sm font-medium text-white-700">
                  Item Type
                </label>
                <select
                  id="itemTypeId"
                  value={itemTypeId}
                  onChange={(e) => setItemTypeId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Item Type</option>
                  {itemTypes.map((itemType) => (
                    <option key={itemType.id} value={itemType.id}>
                      {itemType.typeName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={loading}
                >
                  {loading ? 'saving...':'Save'}
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
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this item?</h2>
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

export default ItemsPage;