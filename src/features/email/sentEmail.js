import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const token = localStorage.getItem('token');

const SentEmail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emails, setEmails] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [modalMessageType, setModalMessageType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}email/sent`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEmails(response.data.emails);
      } catch (err) {
        setError('An error occurred while fetching the emails.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}email/delete-admin/${selectedEmail.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setModalMessageType('success');
      setModalMessage('Email deleted successfully');
      setEmails(emails.filter(email => email.id !== selectedEmail.id));
      setIsDeleteModalOpen(false);
      setSelectedEmail(null);
    } catch (err) {
      setModalMessageType('error');
      setModalMessage(err.response?.data?.message || 'An error occurred while deleting the email.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (email) => {
    setSelectedEmail(email);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    { key: 'subject', label: 'Subject' },
    { key: 'content', label: 'Content' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Sent At', render: (email) => new Date(email.createdAt).toLocaleString() },
    { key: 'actions', label: 'Actions', render: (email) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleDeleteClick(email)}
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
      <h1 className="text-2xl font-bold text-center mb-6">Sent Emails</h1>
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 border border-red-400 rounded-md">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center">
          <p>Loading.</p>
        </div>
      ) : (
        <TableComponent
          title="Sent Emails"
          data={emails}
          columns={columns}
          rowsPerPageOptions={[5, 10, 15]}
          showSearch={true}
          exportable={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        messageType="warning"
        message="Are you sure you want to delete this email?"
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

export default SentEmail;