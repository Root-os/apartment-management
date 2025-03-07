import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';

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

  if (loading) return <LoadingComponent/>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <TableComponent
        title="Settings"
        data={data}
        columns={columns}
        
      />
    </>
  );
};

export default CurrencySettingsPage;
