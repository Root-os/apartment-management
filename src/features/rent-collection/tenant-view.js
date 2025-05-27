import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';

const TenantRentPage = () => {
  const [tenantInfo, setTenantInfo] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('error');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const tenantId = localStorage.getItem('userId');
    if (!tenantId) {
      setMessage('Tenant ID not found in localStorage');
      setMessageType('error');
      setModalOpen(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}rent-collection/${tenantId}`);
        setTenantInfo(response.data.tenant);
        setPaymentHistory(response.data.rentPayments);
      } catch (err) {
        setMessage('Failed to fetch rent payment data.');
        setMessageType('error');
        setModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      key: 'paymentDate',
      label: 'Payment Date',
      render: (row) => new Date(row.paymentDate).toISOString().split('T')[0],
    },
    { key: 'paidDays', label: 'Paid Days' },
    {
      key: 'amountPaid',
      label: 'Amount Paid',
      render: (row) => `${Math.ceil(row.amountPaid)} ETB`,
    },
    {
      key: 'nextDueDate',
      label: 'Next Due Date',
      render: (row) => new Date(row.nextDueDate).toISOString().split('T')[0],
    },
    { key: 'status', label: 'Status' },
    { key: 'paymentMethod', label: 'Method' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : (
        <>
          <TableComponent
            title={`Rent Payment History `}
            data={paymentHistory}
            columns={columns}
            rowsPerPageOptions={[5, 10, 15]}
            showSearch={true}
            exportable={true}
          />

          {paymentHistory.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No rent payment history available.
            </p>
          )}
        </>
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

export default TenantRentPage;
