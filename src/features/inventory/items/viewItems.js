import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table';
import Modal from '../../../components/Modal';
import LoadingComponent from '../../../components/loading';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Added for details modal
  const [itemName, setItemName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [unit, setUnit] = useState('');
  const [itemDetails, setItemDetails] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [isAuditHistoryModalOpen, setIsAuditHistoryModalOpen] = useState(false); // Added for audit history modal
  const [auditHistory, setAuditHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetching items
    axios
      .get(`${process.env.REACT_APP_BASE_URL}items`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
      });

    // Fetching categories
    axios
      .get(`${process.env.REACT_APP_BASE_URL}item-types/`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      })
      .finally(() => {
        // Set loading to false after both requests are completed
        setPageLoading(false);
      });

  }, []);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setItemName(item.itemName);
    setExpirationDate(new Date(item.expirationDate).toISOString().split('T')[0]);
    setItemAmount(item.itemAmount);
    setUnit(item.unit);
    setItemDetails(item.itemDetails);
    setMinAmount(item.min_amount);
    setItemCategoryId(item.itemCategoryId || '');
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDetailsClick = (item) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedItem = {
        itemName,
        expirationDate,
        itemAmount: parseInt(itemAmount),
        unit,
        itemDetails,
        min_amount: parseInt(minAmount),
        itemCategoryId: parseInt(itemCategoryId) || null,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}items/${selectedItem.id}`,
        updatedItem
      );
      
      const updatedData = items.map((item) =>
        item.id === selectedItem.id ? response.data.item : item
      );
      setItems(updatedData);
      setIsEditModalOpen(false);
      setSelectedItem(null);
      setModalOpen(true);
      setMessageType('success');
      setMessage(response.data.message);
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update item');
    } finally {
      setLoading(false);
    }
  };

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

  const handleAuditHistoryClick = (item) => {
    setSelectedItem(item);
    fetchAuditHistory(item.id);
    setIsAuditHistoryModalOpen(true); // Open the audit history modal
  };
  
  const fetchAuditHistory = async (itemId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}items/${itemId}/audit-history`);
      setAuditHistory(response.data); // Set the audit history data
    } catch (error) {
      console.error('Error fetching audit history:', error);
    }
  };

  // Reduced columns for simpler table view
  const columns = [
    { key: 'itemName', label: 'Item Name' },
    { 
      key: 'itemAmount', 
      label: 'Item Amount',
      render: (row) => Math.floor(row.itemAmount)
    },
    {
      key: 'expirationDate',
      label: 'Expiration Date',
      render: (row) => new Date(row.expirationDate).toISOString().split('T')[0],
    },
    { key: 'unit', label: 'Unit' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleDetailsClick(row)}
             className="bg-gray-400 text-white py-1 px-2 rounded"
          >
            Details
          </button>
          <button
            onClick={() => handleEditClick(row)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="bg-red-500 text-white px-3 py-1 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={() => handleAuditHistoryClick(row)} // New button for audit history
            className="bg-green-500 text-white px-3 py-1 rounded-md"
          >
            Audit History
          </button>
        </div>
      ),
    },
  ];
  const handleAddClick = () => {
    window.location.href = '/app/item-add';
   };

  return (
    <div>
      {pageLoading ? (<LoadingComponent/>):(
      <TableComponent
        title="Items List"
        data={items}
        columns={columns}
        exportable={true}
        showSearch={true}
        onAdd={handleAddClick}
      />
    )}
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
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg"
                  required
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
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg"
                  required
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
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="unit" className="block text-sm font-medium text-white-700">
                  Unit
                </label>
                <select   
                 type="text"
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
                  placeholder="Enter measurment"
                  required>
                    <option value="Unit">Unit</option>
                    <option value="Piece">Piece</option>
                    <option value="Set">Set</option>
                    <option value="Kilogram">Kilogram (kg)</option>
                    <option value="Gram">Gram (g)</option>
                    <option value="Liter">Liter (L)</option>
                    <option value="Milliliter">Milliliter (ml)</option>
                    <option value="Meter">Meter (m)</option>
                    <option value="Centimeter">Centimeter (cm)</option>
                    <option value="Box">Box</option>
                    <option value="Pallet">Pallet</option>
                    <option value="Pack">Pack</option>
              </select>
              </div>
              <div className="mb-4">
                <label htmlFor="itemCategoryId" className="block text-sm font-medium text-white-700">
                  Category
                </label>
                <select
                  id="itemCategoryId"
                  value={itemCategoryId}
                  onChange={(e) => setItemCategoryId(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg"
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
                <label htmlFor="itemDetails" className="block text-sm font-medium text-white-700">
                  Item Details
                </label>
                <textarea
                  id="itemDetails"
                  value={itemDetails}
                  onChange={(e) => setItemDetails(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="minAmount" className="block text-sm font-medium text-white-700">
                  Minimum Amount
                </label>
                <input
                  type="number"
                  id="minAmount"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg"
                  required
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

      {/* Details Modal */}
      {isDetailsModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
          <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Item Details</h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Item Name:</span> {selectedItem.itemName}
              </div>
              <div>
                <span className="font-medium">Item Amount:</span> {selectedItem.itemAmount}
              </div>
              <div>
                <span className="font-medium">Unit:</span> {selectedItem.unit}
              </div>
              <div>
                <span className="font-medium">Minimum Amount:</span> {selectedItem.min_amount}
              </div>
              <div>
                <span className="font-medium">Expiration Date:</span> {new Date(selectedItem.expirationDate).toISOString().split('T')[0]}
              </div>
              <div>
                <span className="font-medium">Details:</span> {selectedItem.itemDetails}
              </div>
              <div>
                <span className="font-medium">Category:</span> 
                {categories.find(cat => cat.id === selectedItem.itemCategoryId)?.categoryName || 'Uncategorized'}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this item?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
         {/* Audit History Modal */}
         {isAuditHistoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
          <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Audit History</h2>
            <div>
              {auditHistory.length > 0 ? (
                <ul>
                  {auditHistory.map((history) => (
                    <li key={history.id} className="mb-4">
                      <div><strong>Asset Name:</strong> {history.asset_name}</div>
                      <div><strong>Date:</strong> {new Date(history.date).toISOString().split('T')[0]}</div>
                      <div><strong>Status:</strong> {history.status}</div>
                      <div><strong>Existing Amount:</strong> {history.existing_amount}</div>
                      <div><strong>Damaged Amount:</strong> {history.damaged_amount}</div>
                      <div><strong>Lost Amount:</strong> {history.lost_amount}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No audit history available</div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsAuditHistoryModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
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