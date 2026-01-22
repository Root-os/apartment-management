import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table'; 
import LoadingComponent from '../../components/loading';
import api from '../../utils/api';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`notification/staff-notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data.rows || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    await api.put(`notification/mark-as-read/${notificationId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Update the local state to mark as read
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
      key: 'title',
      label: 'Title',
    },
    {
      key: 'body',
      label: 'Message',
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => row.type?.name || '—',
    },
    // {
    //   key: 'isRead',
    //   label: 'Status',
    //   render: (row) => (
    //     <span className={`px-2 py-1 rounded-full text-white text-xs ${row.isRead ? 'bg-green-500' : 'bg-yellow-500'}`}>
    //       {row.isRead ? 'Read' : 'Unread'}
    //     </span>
    //   ),
    // },
    {
      key: 'createdAt',
      label: 'Date',
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

  return (
    <div className="max-w-7xl mx-auto p-4">
      {loading ? (
        <div className="text-center text-lg font-semibold"><LoadingComponent/></div>
      ) : (
        <TableComponent 
          title="My Notifications"
          data={notifications}
          columns={columns}
          showSearch={true}
          exportable={true}
        />
      )}
    </div>
  );
};

export default NotificationPage;
