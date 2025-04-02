import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const token = localStorage.getItem('token');

// Define the validation schema
const validationSchema = yup.object().shape({
  subject: yup.string().min(8).required('Subject is required'),
  content: yup.string().min(10, 'Content must be at least 10 characters long').required('Content is required'),
});

const SendBulkEmail = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const [loading, setLoading] = useState(false); 
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Handle form submit
  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      subject: data.subject,
      content: data.content,
    };

    try {
       await axios.post(`${process.env.REACT_APP_BASE_URL}email/send-bulk`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setModalOpen(true);
      setMessageType('success');
      setMessage('Bulk email sent successfully');
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage(err.response?.data?.message || 'An error occurred while sending the bulk email.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <><TitleCard title={'Send Bulk Email'} topMargin={'mt-1'}>

      {/* Bulk Email Form */}
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

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-400"
            disabled={loading}
          >
            {loading ? 'Sending Bulk Email...' : 'Send Bulk Email'}
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

export default SendBulkEmail;