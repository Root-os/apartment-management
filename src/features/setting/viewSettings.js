import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table'

const CurrencySettingsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    axios
      .get( `${process.env.REACT_APP_BASE_URL}setting`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      key: 'key',
      label: 'Key',
    },
    {
      key: 'value',
      label: 'Value',
    },
    {
      key: 'unit',
      label: 'Unit',
    },
    {
      key: 'description',
      label: 'Description',
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-4">Currency Settings</h2>
      <TableComponent
        title="Currency Settings"
        data={data}
        columns={columns}
        
      />
    </div>
  );
};

export default CurrencySettingsPage;
