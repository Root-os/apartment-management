import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';
import api from '../../utils/api';

const token = localStorage.getItem('token');

// Define the validation schema
const validationSchema = yup.object().shape({
  subject: yup.string().min(8).required('Subject is required'),
  content: yup.string().min(10, 'Content must be at least 10 characters long').required('Content is required'),
  receiverId: yup.number().required('Receiver is required'),
});

const AddEmail = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const [loading, setLoading] = useState(false); 
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await api.get("/tenant/floor-units");

        const tenants = res.data
          .filter((person) => person.tenant && person.tenant.length > 0)
          .map((person) => ({
            id: person.tenant[0].tenantId, 
            fullName: person.fullName,
            phoneNumber: person.phoneNumber,
          }));

        setTenants(tenants);
      } catch (err) {
        console.error("Error fetching tenants:", err);
      }
    };

    fetchTenants();
  }, []);

  // Handle form submit
  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      receiverId: data.receiverId,
      subject: data.subject,
      content: data.content,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}email/send`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setModalOpen(true);
      setMessageType('success');
      setMessage('Email sent successfully');
      reset(); 
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage(err.response?.data?.message || 'An error occurred while sending the email.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <><TitleCard title={'Send Email'} topMargin={'mt-1'}>

      {/* Email Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-white-700" htmlFor="subject">Email Subject</label>
          <input
            type="text"
            id="subject"
            {...register('subject')}
            className="w-full p-2 border border-gray-300 rounded bg-base-100"
            required
          />
          {errors.subject && <p className="text-red-500">{errors.subject.message}</p>}
        </div>

        <div>
          <label className="block text-white-700" htmlFor="content">Email Content</label>
          <textarea
            id="content"
            {...register('content')}
            className="w-full p-2 border border-gray-300 rounded bg-base-100"
            required
          />
          {errors.content && <p className="text-red-500">{errors.content.message}</p>}
        </div>

        <div>
          <label className="block text-white-700" htmlFor="receiverId">Receiver</label>
          <select
            id="receiverId"
            {...register('receiverId')}
            className="w-full p-2 border border-gray-300 rounded bg-base-100"
            required
          >
            <option value="">Select Receiver</option>
            {tenants.map(tenant => (
              <option key={tenant.id} value={tenant.id}>{tenant.fullName} – {tenant.phoneNumber}</option>
            ))}
          </select>
          {errors.receiverId && <p className="text-red-500">{errors.receiverId.message}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400"
            disabled={loading}
          >
            {loading ? 'Sending Email...' : 'Send Email'}
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

export default AddEmail;