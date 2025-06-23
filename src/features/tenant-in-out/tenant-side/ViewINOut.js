import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table'
import LoadingComponent from '../../../components/loading';
import { useNavigate } from "react-router-dom";

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
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant-inventory/tenant`, {
            headers : { "Authorization": `Bearer ${token}`, }
        });
        const transformedData = response.data.inventories.map(item => ({
          ...item,
          items: JSON.parse(item.items), // Parsing the items JSON string
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

  // Define columns for TableComponent
  const columns = [
    { label: 'Type', key: 'type' },
    { label: 'Notes', key: 'notes' },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
           onClick={() => navigate(`/app/see-my-items`)}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400"
            disabled={loading}
          >
           My Items
          </button>
         
        
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingComponent/>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
