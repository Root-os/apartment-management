import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

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

  useEffect(() => {
    const fetchNotificationData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}notification-type`);
        setNotificationData(response.data);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationData();
  }, []);

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
    setIsLoading(true);
    try {
      const updatedNotification = { name };

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}notification-type/${selectedNotification.id}`, updatedNotification);
      const updatedData = notificationData.map((notification) =>
        notification.id === selectedNotification.id ? response.data : notification
      );
      setNotificationData(updatedData);
      setIsEditModalOpen(false);
      setSelectedNotification(null);

      setModalOpen(true);
      setMessageType('success');
      setModalMessage('Notification type updated successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setModalMessage('Unable to update notification type');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}notification-type/${selectedNotification.id}`);
      setNotificationData(notificationData.filter((notification) => notification.id !== selectedNotification.id));
      setIsDeleteModalOpen(false);
      setSelectedNotification(null);

      setModalOpen(true);
      setMessageType('success');
      setModalMessage('Notification type deleted successfully');
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setModalMessage('Unable to delete notification type');
    } 
  };

  const columns = [
    { label: 'Name', key: 'name' },
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

  // If loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If error, show an error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <TableComponent
        title="Notification Types"
        data={notificationData}
        columns={columns}
        showSearch={true}
        exportable={true}
      />

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
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disable={isLoading}
                >
                  {isLoading ?'saving...':'Save'}
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
            <h2 className="text-xl mb-4">Are you sure you want to delete this notification type?</h2>
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
        message={modalMessage}
      />
    </div>
  );
};

export default NotificationPage;