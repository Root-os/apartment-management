import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoadingComponent from '../../components/loading';
import api from '../../utils/api';


const validationSchema = yup.object().shape({
  title: yup.string().min(3).required('Title is required'),
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
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get(`notification/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNotifications(response.data.data || []); 
      } catch (err) {
        setError('An error occurred while fetching the notifications.');
      } finally {
        setLoading(false);
      }
    };

    const fetchNotificationTypes = async () => {
      try {
        const response = await api.get(`notification-type`, {
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
      const response = await api.put(`notification/update/${selectedNotification.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setModalMessageType('success');
      setModalMessage('Notification updated successfully');
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

const handleDeleteConfirm = async () => {
  if (!selectedNotification) return;
  setButtonLoading(true);
  try {
    await api.delete(`notification/delete-admin/${selectedNotification.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setNotifications(notifications.filter(n => n.id !== selectedNotification.id));
    setIsDeleteModalOpen(false);
    setSelectedNotification(null);

    setModalMessageType('success');
    setModalMessage('Notification deleted successfully');
  } catch (err) {
    console.error(err);
    setModalMessageType('error');
    setModalMessage('Failed to delete notification');
  } finally {
    setButtonLoading(false);
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
      key: 'name',
      label: 'Name',
      render: (notification) => {
        if (!notification.receiver) return 'N/A';
        if (notification.receiver_type === 'staff') {
          return `${notification.receiver.fname} ${notification.receiver.lname}`;
        }
        if (notification.receiver_type === 'tenant') {
          return notification.receiver.fullName || 'N/A';
        }
        return 'N/A';
      }
    },
    {
      key: 'isRead',
      label: 'Status',
      render: (notification) => (
        notification.isRead ? (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
            Read
          </span>
        ) : (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            Sent
          </span>
        )
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (notification) => (
        <div className="flex space-x-2">
          <button
            onClick={() => !notification.isRead && handleEditClick(notification)}
            disabled={notification.isRead}
            className={`py-1 px-2 rounded text-white
              ${notification.isRead
                ? 'bg-blue-200 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-700'}
            `}
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
          showSearch={true}
          exportable={true}
        />
      )}

      {/* Edit Form */}
      {isEditModalOpen && selectedNotification && (
        <div className="fixed inset-0 mt-10 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-base-100 text-base-content p-6 rounded-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
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

              {/* <div>
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
              </div> */}

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
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Are you sure you want to delete this notification?</h2>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={buttonLoading}
              >
                {buttonLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      <Modal
        isOpen={modalMessage !== ''}
        onClose={() => setModalMessage('')}
        messageType={modalMessageType === 'success' ? 'success' : 'error'}
        message={modalMessage}
      />
    </div>
  );
};

export default ViewNotification;