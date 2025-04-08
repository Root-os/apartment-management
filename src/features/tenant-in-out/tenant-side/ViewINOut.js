import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table'
import LoadingComponent from '../../../components/loading';

const TenantInventoryTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    {
      label: 'Items',
      key: 'items',
      render: (row) => (
        <ul>
          {row.items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.quantity} (Condition: {item.condition})
            </li>
          ))}
        </ul>
      ),
    },
    // { label: 'Checked By', key: 'checkedBy' },
    { label: 'Notes', key: 'notes' },
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
