import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import Loading from '../../components/loading';
import api from '../../utils/api'

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
      const response = await api.get('rent-collection/my-rents');

      setPaymentHistory(Array.isArray(response.data) ? response.data : []);

    } catch (err) {
      console.error(err);
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
    key: 'floorNumber',
    label: 'Floor',
    render: (row) => row.Tenant?.Floor?.floorNumber || 'N/A',
  },
  {
    key: 'unitNumber',
    label: 'Unit',
    render: (row) => row.Tenant?.Unit?.unitNumber || 'N/A',
  },
  {
    key: 'paymentDate',
    label: 'Paid From',
    isDate: true,
  },
  {
    key: 'nextDueDate',
    label: 'Paid To',
    isDate: true,
  },
  { key: 'paidDays', label: 'Paid Days' },
  {
    key: 'amountPaid',
    label: 'Amount Paid',
    render: (row) => `${Math.ceil(Number(row.amountPaid))} ETB`,
  },
  { key: 'status', label: 'Status' },
  { key: 'paymentMethod', label: 'Method' },
];


  return (
    <div className="p-6 max-w-6xl mx-auto">
      {loading ? (
      <Loading/>
      ) : (
        <>
<TableComponent
  title="Rent Payment History"
  data={Array.isArray(paymentHistory) ? paymentHistory : []}
  columns={columns}
  showSearch={true}
  exportable={true}
/>


          {/* {paymentHistory.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No rent payment history available.
            </p>
          )} */}
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
