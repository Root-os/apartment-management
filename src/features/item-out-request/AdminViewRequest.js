import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import api from '../../utils/api';

const TenantItemOutRequests = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get('item-out-request/admin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTenants(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { label: 'Tenant Name', key: 'tenantName' },
    { label: 'Phone Number', key: 'phoneNumber' },
    { label: 'Email', key: 'email' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <button
          onClick={() =>
            navigate(`/app/see-request-detail`, { state: { tenant: row } })
          }
          className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
        >
          View Requests
        </button>
      ),
    },
  ];

  if (loading) return <LoadingComponent />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <TableComponent
      title="All Tenants Item Out Requests"
      data={tenants}
      columns={columns}
      rowsPerPageOptions={[5, 10, 20]}
      showSearch={true}
      exportable={true}
    />
  );
};

export default TenantItemOutRequests;
