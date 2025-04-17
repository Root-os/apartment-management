import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table'; 
import LoadingComponent from '../../components/loading';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}notification/my-notification`, {
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
