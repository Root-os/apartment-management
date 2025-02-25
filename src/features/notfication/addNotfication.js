import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const token = localStorage.getItem('token');
const userId = localStorage.getItem('UserId');

// Define the validation schema
const validationSchema = yup.object().shape({
  title: yup.string().min(8).required('Title is required'),
  body: yup.string().min(10, 'Body must be at least 10 characters long').required('Body is required'),
  receiver_id: yup.number().required('Receiver is required'),
  receiver_type: yup.string().oneOf(['tenant', 'staff']).required('Receiver type is required'),
  type_id: yup.number().required('Notification type is required'),
});

const AddNotification = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const [loading, setLoading] = useState(false); 
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const [users, setUsers] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [notificationTypes, setNotificationTypes] = useState([]);

  const receiverType = watch('receiver_type');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data.users.filter(user => user.role === 'employee'));
      } catch (err) {
        console.error('Error fetching users', err);
      }
    };

    const fetchTenants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTenants(response.data);
      } catch (err) {
        console.error('Error fetching tenants', err);
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
        console.error('Error fetching notification types', err);
      }
    };

    fetchUsers();
    fetchTenants();
    fetchNotificationTypes();
  }, []);

  // Handle form submit
  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      receiver_type: data.receiver_type,
      receiverId: data.receiver_id, // Adjusted key
      senderId: userId, // Use senderId from localStorage
      title: data.title,
      body: data.body,
      type_id: data.type_id,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}notification/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setModalOpen(true);
      setMessageType('success');
      setMessage('Notification created successfully');
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage(err.response?.data?.message || 'An error occurred while creating the notification.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <><TitleCard title={'Create Notification'}>

      {/* Notification Form */}
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
          <label className="block text-white-700" htmlFor="receiver_type">Receiver Type</label>
          <select
            id="receiver_type"
            {...register('receiver_type')}
            className="w-full p-2 border border-gray-300 rounded bg-base-100"
            required
          >
            <option value="">Select Receiver Type</option>
            <option value="tenant">Tenant</option>
            <option value="staff">Staff</option>
          </select>
          {errors.receiver_type && <p className="text-red-500">{errors.receiver_type.message}</p>}
        </div>

        {receiverType === 'tenant' && (
          <div>
            <label className="block text-white-700" htmlFor="receiver_id">Receiver</label>
            <select
              id="receiver_id"
              {...register('receiver_id')}
              className="w-full p-2 border border-gray-300 rounded bg-base-100"
              required
            >
              <option value="">Select Tenant</option>
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>{tenant.fullName}</option>
              ))}
            </select>
            {errors.receiver_id && <p className="text-red-500">{errors.receiver_id.message}</p>}
          </div>
        )}

        {receiverType === 'staff' && (
          <div>
            <label className="block text-white-700" htmlFor="receiver_id">Receiver</label>
            <select
              id="receiver_id"
              {...register('receiver_id')}
              className="w-full p-2 border border-gray-300 rounded bg-base-100"
              required
            >
              <option value="">Select Staff</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.fname} {user.lname}</option>
              ))}
            </select>
            {errors.receiver_id && <p className="text-red-500">{errors.receiver_id.message}</p>}
          </div>
        )}

        <div>
          <label className="block text-white-700" htmlFor="type_id">Notification Type</label>
          <select
            id="type_id"
            {...register('type_id')}
            className="w-full p-2 border border-gray-300 rounded bg-base-100"
            required
          >
            <option value="">Select Notification Type</option>
            {notificationTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          {errors.type_id && <p className="text-red-500">{errors.type_id.message}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400"
            disabled={loading}
          >
            {loading ? 'Creating Notification...' : 'Create Notification'}
          </button>
        </div>
      </form>
      </TitleCard>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
        />
    </>
  );
};

export default AddNotification;