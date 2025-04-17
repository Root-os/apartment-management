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

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const iconMapping = {
    notifications: <FaBell size={30} />,
    stockouts: <FaBoxes size={30} />,
    salaries: <FaMoneyCheckAlt size={30} />
  };

  if (loading) return <div><Loading/></div>;
  if (error) return <div>{error}</div>;

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
                <div className="flex-shrink-0">{iconMapping.notifications}</div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Notifications</h3>
                  <p className="text-lg text-black">
                    {counts.notifications.totalNotifications} Total | {counts.notifications.unreadNotifications} Unread
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stockouts Card */}
          <div
            className="card hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: generateRandomColor() }}
          >
            <div className="card-body p-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{iconMapping.stockouts}</div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Stockouts</h3>
                  <p className="text-lg text-black">
                    {counts.stockouts.totalStockouts} Total | {counts.stockouts.pendingStockouts} Pending | {counts.stockouts.approvedStockouts} Approved
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Salaries Card */}
          <div
            className="card hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: generateRandomColor() }}
          >
            <div className="card-body p-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{iconMapping.salaries}</div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Salaries</h3>
                  <p className="text-lg text-black">
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
