import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import Modal from '../../components/Modal';

const TenantPaymentRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [uploadingForId, setUploadingForId] = useState(null);

  useEffect(() => {
    fetchRequests();
    fetchPaymentTypes();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}payment-requests/tenant/my-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data.data);
    } catch (error) {
      setMessage('Failed to load payment requests');
      setMessageType('error');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentTypes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}payment-types`);
      setPaymentTypes(response.data);
    } catch (error) {
      console.error('Error fetching payment types', error);
    }
  };

  const handleReceiptUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !uploadingForId) return;

    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}payment-requests/upload-receipt/${uploadingForId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setModalOpen(true);
      setMessageType('success'); 
      setMessage('Receipt uploaded successfully!');
      setUploadingForId(null);
      fetchRequests(); // refresh table
    } catch (error) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Upload failed. Please try again.');
    }
  };

  const columns = [
    { key: 'message', label: 'Message' },
    { key: 'level', label: 'Level' },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => `${Math.round(row.amount)}`,
    },
    {
      key: 'paymentTypeId',
      label: 'Payment Type',
      render: (row) => {
        const paymentType = paymentTypes.find((type) => type.id === row.paymentTypeId);
        return paymentType ? paymentType.name : 'Unknown';
      },
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (row) => new Date(row.dueDate).toISOString().split('T')[0],
    },
    { key: 'repeatedFor', label: 'Repeated For' },
    { key: 'status', label: 'Status' },
    {
      key: 'receipt',
      label: 'Receipt',
      render: (row) =>
        row.receipt ? (
          <a
            href={row.receipt}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1d4ed8', textDecoration: 'none' }}
            onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
            onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
          >
            View
          </a>
        ) : (
          <span>No receipt</span>
        ),
    },
    {
      key: 'upload',
      label: 'Action',
      render: (row) => (
        <>
          <input
            type="file"
            accept="image/*,application/pdf"
            style={{ display: 'none' }}
            id={`upload-input-${row.id}`}
            onChange={handleReceiptUpload}
          />
          <button
            onClick={() => {
              setUploadingForId(row.id);
              document.getElementById(`upload-input-${row.id}`).click();
            }}
            className={`px-2 py-1 rounded-md text-white mr-2 text-sm
              ${row.receipt ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {row.receipt ? 'Update Receipt' : 'Upload Receipt'}
          </button>

        </>
      ),
    },

  ];

  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <TableComponent title="My Payment Requests" data={requests} columns={columns} showSearch={true} />
      )}

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        messageType={messageType} 
        message={message} 
      />
    </div>
  );
};

export default TenantPaymentRequestsPage;
