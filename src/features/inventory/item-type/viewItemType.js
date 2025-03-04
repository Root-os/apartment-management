import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table';
import Modal from '../../../components/Modal'

const ItemTypesPage = () => {
  const [itemTypes, setItemTypes] = useState([]);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}item-types`)
      .then((response) => {
        setItemTypes(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the item types:', error);
      });
  }, []);

  // Handle edit button click
  const handleEditClick = (itemType) => {
    setSelectedItemType(itemType);
    setCategoryName(itemType.categoryName);
    setDescription(itemType.description);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (itemType) => {
    setSelectedItemType(itemType);
    setIsDeleteModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    setLoading(true);
    try {
      const updatedItemType = {
        categoryName,
        description,
      };

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}item-types/${selectedItemType.id}`, updatedItemType);
      const updatedData = itemTypes.map((itemType) =>
        itemType.id === selectedItemType.id ? response.data : itemType
      );
      setItemTypes(updatedData);
      setIsEditModalOpen(false);
      setSelectedItemType(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Item type updated successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update item type');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}item-types/${selectedItemType.id}`);
      setItemTypes(itemTypes.filter((itemType) => itemType.id !== selectedItemType.id));
      setIsDeleteModalOpen(false);
      setSelectedItemType(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Item type deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete item type');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'categoryName', label: 'Category Name' },
    { key: 'description', label: 'Description' },
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
    <>
      <TableComponent
        title="Item Types List"
        data={itemTypes}
        columns={columns}
        exportable={true}
        showSearch={true}
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit Item Type</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-white-700">
                  Type Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-white-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
            <h2 className="text-xl mb-4">Are you sure you want to delete this item type?</h2>
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
    </>
  );
};

export default ItemTypesPage;