import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal'; // Imported Modal for success/error messages
import LoadingComponent from '../../components/loading';
import api from '../../utils/api';

const token = localStorage.getItem('token');

const SentEmail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emails, setEmails] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Custom state for delete confirmation modal
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [modalMessageType, setModalMessageType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await api.get(`email/sent`, {
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
    

    try {
      await api.delete(`email/delete-admin/${selectedEmail.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setModalMessageType('success');
      setModalMessage('Email deleted successfully');
      setEmails(emails.filter(email => email.id !== selectedEmail.id));
      setDeleteModalOpen(false); // Close the delete modal after deletion
      setSelectedEmail(null);
    } catch (err) {
      setModalMessageType('error');
      setModalMessage(err.response?.data?.message || 'An error occurred while deleting the email.');
    } 
  };

  const handleDeleteClick = (email) => {
    setSelectedEmail(email);
    setDeleteModalOpen(true); // Show delete confirmation modal
  };

  const columns = [
    { 
      key: 'receiver', 
      label: 'Receiver',
      render: (email) => email.receiver ? email.receiver.fullName : ''
    },
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
    <div>
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 border border-red-400 rounded-md">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center">
          <LoadingComponent />
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

      {/* Custom Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this email?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)} // Close modal on cancel
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete} // Proceed with delete
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Modal controlled by state */}
      {modalMessage && (
        <Modal
          isOpen={modalMessage !== ''}
          onClose={() => setModalMessage('')} 
          messageType={modalMessageType}
          message={modalMessage}
        />
      )}
    </div>
  );
};

export default SentEmail;
