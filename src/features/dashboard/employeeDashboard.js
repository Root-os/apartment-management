import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell, FaBoxes, FaMoneyCheckAlt } from 'react-icons/fa';
import Loading from '../../components/loading'; // Assume you have a loading component

const EmployeeDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}dashboard/employee-dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCounts(response.data);
      } catch (err) {
        setError('Error loading employee dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateDarkRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 12)]; // Use only darker hex digits (0-B)
    }
    return color;
  };

  const iconMapping = {
    notifications: <FaBell size={50} className="text-white" />,
    stockouts: <FaBoxes size={50} className="text-white" />,
    salaries: <FaMoneyCheckAlt size={50} className="text-white" />
  };

  if (loading) return <div><Loading /></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:gap-8">
      {counts && (
        <>
          {/* Notifications Card */}
          <div
            className="card hover:shadow-2xl transition-transform transform hover:scale-105 rounded-xl"
            style={{ backgroundColor: generateDarkRandomColor() }}
          >
            <div className="card-body p-10">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">{iconMapping.notifications}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Notifications</h3>
                  <p className="text-lg font-semibold text-white">
                    {counts.notifications.totalNotifications} Total  | {counts.notifications.unreadNotifications} Unread
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stockouts Card */}
          <div
            className="card hover:shadow-2xl transition-transform transform hover:scale-105 rounded-xl"
            style={{ backgroundColor: generateDarkRandomColor() }}
          >
            <div className="card-body p-10">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">{iconMapping.stockouts}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Stockouts</h3>
                  <p className="text-lg font-semibold text-white">
                    {counts.stockouts.totalStockouts} Total | {counts.stockouts.pendingStockouts} Pending | {counts.stockouts.approvedStockouts} Approved
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Salaries Card */}
          <div
            className="card hover:shadow-2xl transition-transform transform hover:scale-105 rounded-xl"
            style={{ backgroundColor: generateDarkRandomColor() }}
          >
            <div className="card-body p-10">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">{iconMapping.salaries}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Salaries</h3>
                  <p className="text-lg font-semibold text-white">
                    {counts.salaries.totalSalaries} Total | {counts.salaries.pendingSalaries} Pending | {counts.salaries.paidSalaries} Paid
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

export default EmployeeDashboard;
