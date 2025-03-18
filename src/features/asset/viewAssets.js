import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/card';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const AssetPage = () => {
  const [assetTypes, setAssetTypes] = useState([]);
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setPageLoading(true);
    axios
      .get(`http://127.0.0.1:3000/api/asset`)
      .then((response) => {
        setAssetTypes(response.data.data);
        setPageLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the asset types:', error);
        setPageLoading(false);
      });
  }, []);

  const filteredAssetTypes = assetTypes.filter((assetType) =>
    (assetType.name && assetType.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (assetType.description && assetType.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditClick = (assetType) => {
    setSelectedAssetType(assetType);
    setCategoryName(assetType.name);
    setDescription(assetType.description);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (assetType) => {
    setSelectedAssetType(assetType);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = async () => {
    setLoading(true);
    const updatedAssetType = {
      ...selectedAssetType, // Preserve all existing properties
      name: categoryName,
      description: description,
    };

    // Optimistically update the state
    setAssetTypes(prevAssetTypes => 
      prevAssetTypes.map(assetType => 
        assetType.id === selectedAssetType.id ? updatedAssetType : assetType
      )
    );

    try {
      const response = await axios.put(
        `http://127.0.0.1:3000/api/asset/${selectedAssetType.id}`,
        {
          name: categoryName,
          description: description,
        }
      );

      // Update with server response to ensure sync
      setAssetTypes(prevAssetTypes =>
        prevAssetTypes.map(assetType =>
          assetType.id === selectedAssetType.id ? response.data : assetType
        )
      );

      setIsEditModalOpen(false);
      setSelectedAssetType(null);
      setModalOpen(true);
      setMessageType('success');
      setMessage('Asset type updated successfully');
    } catch (error) {
      // Roll back to original data on error
      setAssetTypes(prevAssetTypes =>
        prevAssetTypes.map(assetType =>
          assetType.id === selectedAssetType.id ? selectedAssetType : assetType
        )
      );
      
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to update asset type');
      console.error('Edit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:3000/api/asset/${selectedAssetType.id}`);
      setAssetTypes(assetTypes.filter((assetType) => assetType.id !== selectedAssetType.id));
      setIsDeleteModalOpen(false);
      setSelectedAssetType(null);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Asset type deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete asset type');
    } finally {
      setLoading(false);
    }
  };

  const getCardActions = (assetType) => [
    {
      label: 'Edit',
      type: 'primary',
      onClick: () => handleEditClick(assetType),
    },
    {
      label: 'Delete',
      type: 'secondary',
      onClick: () => handleDeleteClick(assetType),
    },
  ];

  return (
    <>
      <div className="p-4 mb-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white-800">Assets</h1>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full bg-base-100 p-2 border border-gray-300 rounded-md"
        />
      </div>

      {pageLoading ? (
        <LoadingComponent />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssetTypes.length > 0 ? (
            filteredAssetTypes.map((assetType) => (
              <Card
                key={assetType.id}
                title={assetType.name}
                content={assetType.description}
                actions={getCardActions(assetType)}
              />
            ))
          ) : (
            <p>No asset found</p>
          )}
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-md w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit Asset</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-white-700">
                  Category Name
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

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this asset type?</h2>
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

export default AssetPage;