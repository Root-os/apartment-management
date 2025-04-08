import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoadingComponent from '../../components/loading';

// Define the validation schema for editing notification
const validationSchema = yup.object().shape({
  title: yup.string().min(8).required('Title is required'),
  body: yup.string().min(10, 'Body must be at least 10 characters long').required('Body is required'),
  type_id: yup.number().required('Notification type is required'),
  isRead: yup.boolean().required('Read status is required'),
});

const token = localStorage.getItem('token');

const ViewNotification = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationTypes, setNotificationTypes] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalMessageType, setModalMessageType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}notification/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNotifications(response.data.data || []); // Use 'data' instead of 'rows'
      } catch (err) {
        setError('An error occurred while fetching the notifications.');
      } finally {
        setLoading(false);
      }
    };

    const fetchNotificationTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}notification-type`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNotificationTypes(response.data);
      } catch (err) {
        setError('An error occurred while fetching the notification types.');
      }
    };

    fetchNotifications();
    fetchNotificationTypes();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}notification/update/${selectedNotification.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setModalMessageType('success');
      setModalMessage('Notification updated successfully');
      // Adjust based on actual API response structure
      setNotifications(notifications.map(notification => 
        notification.id === selectedNotification.id ? response.data.notification || response.data : notification
      ));
      setSelectedNotification(null);
      setIsEditModalOpen(false);
    } catch (err) {
      setModalMessageType('error');
      setModalMessage(err.response?.data?.message || 'An error occurred while updating the notification.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}notification/delete-admin/${selectedNotification.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setModalMessageType('success');
      setModalMessage('Notification deleted successfully');
      setNotifications(notifications.filter(notification => notification.id !== selectedNotification.id));
      setIsDeleteModalOpen(false);
      setSelectedNotification(null);
    } catch (err) {
      setModalMessageType('error');
      setModalMessage(err.response?.data?.message || 'An error occurred while deleting the notification.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (notification) => {
    setSelectedNotification(notification);
    setValue('title', notification.title);
    setValue('body', notification.body);
    setValue('type_id', notification.type_id);
    setValue('isRead', notification.isRead);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (notification) => {
    setSelectedNotification(notification);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'body', label: 'Body' },
    { key: 'type', label: 'Type', render: (notification) => notification.type ? notification.type.name : 'N/A' },
    { key: 'receiver_type', label: 'Receiver Type' },
    { 
      key: 'isRead', 
      label: 'Status', 
      render: (notification) => notification.isRead ? "Read" : "Sent" 
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (notification) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditClick(notification)}
            className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(notification)}
            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8">
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 border border-red-400 rounded-md">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center">
         <LoadingComponent/>
        </div>
      ) : (
        <TableComponent
          title="Notifications"
          data={notifications}
          columns={columns}
          rowsPerPageOptions={[5, 10, 15]}
          showSearch={true}
          exportable={true}
        />
      )}

      {/* Edit Form */}
      {isEditModalOpen && selectedNotification && (
        <div className="fixed inset-0 mt-10 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl mb-4">Edit Notification</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-white-700" htmlFor="title">Notification Title</label>
                <input
                  type="text"
                  id="title"
                  {...register('title')}
                  className="w-full p-2 border border-gray-300 rounded bg-base-100"
                  required
                />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-white-700" htmlFor="body">Notification Body</label>
                <textarea
                  id="body"
                  {...register('body')}
                  className="w-full p-2 border border-gray-300 rounded bg-base-100"
                  required
                />
                {errors.body && <p className="text-red-500">{errors.body.message}</p>}
              </div>

              <div>
                <label className="block text-white-700" htmlFor="type_id">Notification Type</label>
                <select
                  id="type_id"
                  {...register('type_id')}
                  className="w-full p-2 border border-gray-300 rounded bg-base-100"
                  required
                >
                  {notificationTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                {errors.type_id && <p className="text-red-500">{errors.type_id.message}</p>}
              </div>

              <div>
                <label className="block text-white-700" htmlFor="isRead">Read Status</label>
                <select
                  id="isRead"
                  {...register('isRead')}
                  className="w-full p-2 border border-gray-300 rounded bg-base-100"
                  required
                >
                  <option value={true}>Read</option>
                  <option value={false}>Unread</option>
                </select>
                {errors.isRead && <p className="text-red-500">{errors.isRead.message}</p>}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? 'Updating Notification...' : 'Update Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        messageType="warning"
        message="Are you sure you want to delete this notification?"
        actions={[
          {
            label: "Cancel",
            onClick: () => setIsDeleteModalOpen(false),
            className: "bg-gray-400 text-white px-4 py-2 rounded"
          },
          {
            label: "Delete",
            onClick: handleDelete,
            className: "bg-red-500 text-white px-4 py-2 rounded"
          }
        ]}
      />

      {/* Success/Error Modal */}
      <Modal
        isOpen={modalMessage !== ''}
        onClose={() => setModalMessage('')}
        messageType={modalMessageType === 'success' ? 'success' : 'error'}
        message={modalMessage}
        actions={[
          {
            label: "Close",
            onClick: () => setModalMessage(''),
            className: "bg-blue-500 text-white px-4 py-2 rounded"
          }
        ]}
      />
    </div>
  );
};

export default ViewNotification;