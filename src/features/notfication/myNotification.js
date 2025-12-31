import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table'; 
import LoadingComponent from '../../components/loading'; 
import api from '../../utils/api';

const TenantNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await api.get(`notification/my-notification`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setNotifications(response.data.rows || []); 
      } catch (err) {
        setError(err.message || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);


  const columns = [
    {
      label: 'Title',
      key: 'title',
    },
    {
      label: 'Body',
      key: 'body',
    },
    // {
    //   label: 'Status',
    //   key: 'isRead',
    //   render: (row) => (row.isRead ? 'Read' : 'Unread'),
    // },
    {
      label: 'Type',
      key: 'type',
      render: (row) => row.type?.name || 'N/A', 
    },
    {
      label: 'Recieved At',
      key: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  
  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <TableComponent
        title="My Notifications"
        data={notifications}
        columns={columns}
        showSearch={true}
        exportable={true} 
      />
    </div>
  );
};

export default TenantNotificationPage;