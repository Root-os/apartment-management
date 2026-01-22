import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableComponent from '../../../components/table';
import LoadingComponent from '../../../components/loading';
import api from '../../../utils/api';

const TenantInventoryTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); 
      try {
        const response = await api.get(`tenant-inventory/tenant`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        // Backend now returns items as array, no need to parse
        const transformedData = response.data.inventories.map(item => ({
          ...item,
          // Keep items as they are
          items: item.items,
        }));

        setData(transformedData);
        setLoading(false);
      } catch (error) {
        setError(error.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define columns for TableComponent, including Unit and Floor
  const columns = [
    { label: 'Type', key: 'type' },
    { label: 'Notes', key: 'notes' },
    { label: 'Unit', key: 'unitNumber' },
    { label: 'Floor', key: 'floorNumber' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/app/see-my-items`, { state: { items: row.items } })}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400"
            disabled={loading}
          >
            My Items
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;

  return (
    <TableComponent
      title="Tenant Inventory"
      data={data}
      columns={columns}
      rowsPerPageOptions={[5, 10, 15]}
      showSearch={true}
      exportable={true}
    />
  );
};

export default TenantInventoryTable;
