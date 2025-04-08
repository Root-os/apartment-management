import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table'; // Adjust the path as needed
import LoadingComponent from '../../components/loading'; // Assume you have a loading component

const TenantNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token'); // Get tenant token from local storage
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}notification/my-notification`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        });

        // Assuming the response matches the provided structure
        setNotifications(response.data.rows || []); // Use rows from the response
      } catch (err) {
        setError(err.message || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Define table columns based on the response structure
  const columns = [
    {
      label: 'Title',
      key: 'title',
    },
    {
      label: 'Body',
      key: 'body',
    },
    {
      label: 'Status',
      key: 'isRead',
      render: (row) => (row.isRead ? 'Read' : 'Unread'),
    },
    {
      label: 'Type',
      key: 'type',
      render: (row) => row.type?.name || 'N/A', // Access nested type.name
    },
    {
      label: 'Recieved At',
      key: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleString(), // Format date
    },
  ];

  // Handle loading and error states
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
        rowsPerPageOptions={[5, 10, 20]}
        showSearch={true}
        exportable={true} // Allows CSV and PDF export
      />
    </div>
  );
};

export default TenantNotificationPage;