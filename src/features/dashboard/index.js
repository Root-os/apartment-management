import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell, FaCreditCard, FaExclamationCircle } from 'react-icons/fa';

const Dashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setCounts(response.data); 
      } catch (error) {
        setError('Error loading data: ');
        console.error('Error fetching data');
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Icons mapping based on the counts data
  const iconMapping = {
    notifications: <FaBell size={30} />,
    payments: <FaCreditCard size={30} />,
    complaints: <FaExclamationCircle size={30} />,
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      {counts && (
        <>
          {/* Notifications Card */}
          <div
            className="card hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: generateRandomColor() }}
          >
            <div className="card-body p-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="text-black">{iconMapping.notifications}</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Notifications</h3>
                  <p className="text-lg text-black">
                     {counts.notifications.totalNotifications} 
                     {/* | Sent: {counts.notifications.sentNotifications} | Read: {counts.notifications.readNotifications} */}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payments Card */}
          <div
            className="card hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: generateRandomColor() }}
          >
            <div className="card-body p-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="text-black">{iconMapping.payments}</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Payments</h3>
                  <p className="text-lg text-black">
                   {counts.payments.totalPayments} 
                   {/* | Pending: {counts.payments.pendingPayments} | Completed: {counts.payments.completedPayments} */}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Complaints Card */}
          <div
            className="card hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: generateRandomColor() }}
          >
            <div className="card-body p-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="text-black">{iconMapping.complaints}</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Complaints</h3>
                  <p className="text-lg text-black">
                  {counts.complaints.totalComplaints} 
                    {/* | In Progress: {counts.complaints.inProgressComplaints} | Resolved: {counts.complaints.resolvedComplaints} | Not Resolved: {counts.complaints.notResolvedComplaints} */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;