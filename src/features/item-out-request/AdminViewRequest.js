import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';

const ItemOutRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}item-out-request/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch item out requests');
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    setUpdatingId(id);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}item-out-request/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update state with new status
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.error || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    { label: 'Tenant Name', key: 'tenantName' },
    { label: 'Item Name', key: 'itemName', render: row => row.item?.itemName || row.name || 'N/A' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Status', key: 'status' },
    {
      label: 'Requested At',
      key: 'createdAt',
      render: row => new Date(row.createdAt).toISOString().split('T')[0]
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => {
        if (row.status === 'Approved') {
          return (
            <span className="px-3 py-1 bg-green-300 text-white rounded text-sm font-semibold cursor-default">
              Approved
            </span>
          );
        }

        if (row.status === 'Rejected') {
          return (
            <span className="px-3 py-1 bg-red-300 text-white rounded text-sm font-semibold cursor-default">
              Rejected
            </span>
          );
        }

        return (
          <div className="flex space-x-2">
            <button
              onClick={() => updateStatus(row.id, 'Approved')}
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              disabled={updatingId === row.id}
            >
              Approve
            </button>
            <button
              onClick={() => updateStatus(row.id, 'Rejected')}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              disabled={updatingId === row.id}
            >
              Reject
            </button>
          </div>
        );
      },
    }
  ];

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <TableComponent
      title="All Tenant Item Out Requests"
      data={requests}
      columns={columns}
      rowsPerPageOptions={[5, 10, 20]}
      showSearch={true}
      exportable={true}
    />
  );
};

export default ItemOutRequests;
