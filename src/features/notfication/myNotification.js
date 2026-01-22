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


  const handleMarkAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    await api.put(`notification/mark-as-read/${notificationId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'Failed to mark notification as read');
  }
};


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
    {
      label: 'Status',
      key: 'status',
      render: (row) => (
        row.isRead ? (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
            Read
          </span>
        ) : (
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition flex items-center gap-1"
            onClick={() => handleMarkAsRead(row.id)}
          >
            Mark as Read
          </button>
        )
      ),
    }

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