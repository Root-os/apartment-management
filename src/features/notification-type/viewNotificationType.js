import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const NotificationPage = () => {
  const [notificationData, setNotificationData] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch notification data function
  const fetchNotificationData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}notification-type`);
      setNotificationData(response.data);
    } catch (error) {
      setError('Error fetching notification data');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationData();
  }, []);

  // Filtered notificationData based on the search term
  const filteredNotificationData = notificationData.filter((notification) =>
    notification.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit button click
  const handleEditClick = (notification) => {
    setSelectedNotification(notification);
    setName(notification.name);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (notification) => {
    setSelectedNotification(notification);
    setIsDeleteModalOpen(true);
  };

  // Handle edit request
  const handleEdit = async () => {
    if (!name.trim()) {
      setModalOpen(true);
      setMessageType('error');
      setModalMessage('Name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const updatedNotification = { name };
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}notification-type/${selectedNotification.id}`,
        updatedNotification
      );

      // After updating, directly fetch the updated data instead of optimistic update
      await fetchNotificationData();

      setIsEditModalOpen(false);
      setSelectedNotification(null);
      setName('');

      setModalOpen(true);
      setMessageType('success');
      setModalMessage('Notification type updated successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setModalMessage(error.response?.data?.message || 'Unable to update notification type');
      console.error('Edit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}notification-type/${selectedNotification.id}`);

      // After deleting, directly fetch the updated data instead of optimistic update
      await fetchNotificationData();

      setIsDeleteModalOpen(false);
      setSelectedNotification(null);

      setModalOpen(true);
      setMessageType('success');
      setModalMessage('Notification type deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setModalMessage(error.response?.data?.message || 'Unable to delete notification type');
      console.error('Delete error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white-800">Notification Types</h1>
      </div>

      {/* Search Bar */}
      <div className="p-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search notification types..."
          className="w-full bg-base-100 p-2 border border-gray-300 rounded-md"
        />
      </div>

      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {filteredNotificationData.length > 0 ? (
    filteredNotificationData.map((notification) => (
      <div
        key={notification.id}
        className="bg-base-100 p-4 rounded-lg shadow-lg border border-gray-300"
      >
        <h3 className="text-lg font-semibold text-white-800">{notification.name}</h3>
        <div className="mt-4 flex justify-end space-x-1">
          <button
            onClick={() => handleEditClick(notification)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(notification)}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ))
  ) : (
    <p>No notification types found</p>
  )}
</div>

      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12">
          <div className="bg-base-100 p-6 rounded-md w-1/3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Notification Type</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-white-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 bg-base-100 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedNotification(null);
                    setName('');
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                  disabled={isLoading}
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
            <h2 className="text-xl mb-4">Are you sure you want to delete this notification type?</h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={modalMessage}
      />
    </div>
  );
};

export default NotificationPage;
