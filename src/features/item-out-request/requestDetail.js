import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import api from '../../utils/api';
import ConfirmModal from '../../components/confirmationModal';
import Modal from '../../components/Modal';

const TenantRequestsDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenant } = location.state || {};
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, status: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  if (!tenant) {
    return (
      <div className="container mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition mb-4"
        >
          Back
        </button>
        <p className="text-center text-gray-500">No tenant selected.</p>
      </div>
    );
  }

const UpdateStatus = async () => {
    const { id, status } = confirmModal;
    const token = localStorage.getItem('token');
    setUpdatingId(id);
    try {
      await api.patch(`item-out-request/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });

      tenant.requests = tenant.requests.map((r) =>
        r.id === id ? { ...r, status } : r
      );

      // setAlertModal({ isOpen: true, message: `Request ${status.toLowerCase()} successfully.` });
        setModalOpen(true);
        setMessageType('success');
        setMessage(`Request ${status.toLowerCase()} successfully.`);
    } catch (err) {
      // setAlertModal({ isOpen: true, message: `Failed to ${status.toLowerCase()}: ${err.response?.data?.error || err.message}` });
        setModalOpen(true);
        setMessageType('error');
        setMessage(`Failed to ${status.toLowerCase()}: ${err.response?.data?.error || err.message}`);
    } finally {
      setUpdatingId(null);
      setConfirmModal({ isOpen: false, id: null, status: null });
    }
  };

  const columns = [
    { label: 'Unit', key: 'unitNumber' },
    { label: 'Floor', key: 'floorNumber' },
    {
      label: 'Item Name',
      key: 'itemName',
      render: (row) => row.item?.itemName || row.name || 'N/A',
    },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Status', key: 'status' },
    { label: 'Requested At', key: 'createdAt', isDate: true },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => {
        if (row.status === 'Approved') return <span className="px-3 py-1 bg-green-300 text-white rounded text-sm">Approved</span>;
        if (row.status === 'Rejected') return <span className="px-3 py-1 bg-red-300 text-white rounded text-sm">Rejected</span>;

        return (
                    <div className="flex space-x-2">
            <button
              onClick={() => setConfirmModal({ isOpen: true, id: row.id, status: 'Approved' })}
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              disabled={updatingId === row.id}
            >
              Approve
            </button>
            <button
              onClick={() => setConfirmModal({ isOpen: true, id: row.id, status: 'Rejected' })}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              disabled={updatingId === row.id}
            >
              Reject
            </button>
          </div>
        );
      },
    },
  ];

  if (!tenant.requests || tenant.requests.length === 0) return <LoadingComponent />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          Back
        </button>
      </div>
      <TableComponent
        title={`Requests for ${tenant.tenantName}`}
        data={tenant.requests}
        columns={columns}
        rowsPerPageOptions={[5, 10, 20]}
        showSearch={true}
        exportable={true}
      />

        <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={`Confirm ${confirmModal.status}`}
        message={`Are you sure you want to ${confirmModal.status?.toLowerCase()} this request?`}
        onConfirm={UpdateStatus}
        onCancel={() => setConfirmModal({ isOpen: false, id: null, status: null })}
      />

            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              messageType={messageType}
              message={message}
            />
    </div>
  );
};

export default TenantRequestsDetail;
