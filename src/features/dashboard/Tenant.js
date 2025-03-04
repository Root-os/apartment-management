import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell, FaCreditCard, FaExclamationCircle, FaHome, FaCar, FaParking } from 'react-icons/fa';

const TenantDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard/for-tenant`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCounts(response.data);
      } catch (error) {
        setError('Error loading data');
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

  // Icons mapping for the sections
  const iconMapping = {
    notifications: <FaBell size={30} />,
    paymentsRequest: <FaCreditCard size={30} />,
    complaints: <FaExclamationCircle size={30} />,
    rentCollections: <FaHome size={30} />,
    tenantInventories: <FaHome size={30} />,
    tenantVehicles: <FaCar size={30} />,
    parking: <FaParking size={30} />,
    tenantPayments: <FaCreditCard size={30} />,
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

          {/* Payments Requests Card */}
          <div
            className="card hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: generateRandomColor() }}
          >
            <div className="card-body p-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{iconMapping.paymentsRequest}</div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Payments Requests</h3>
                  <p className="text-lg text-black">
                    {counts.paymentsRequest.totalPaymentsRequest} Total | {counts.paymentsRequest.pendingPaymentsRequest} Pending | {counts.paymentsRequest.completedPaymentsRequest} Completed
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
                <div className="flex-shrink-0">{iconMapping.complaints}</div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Complaints</h3>
                  <p className="text-lg text-black">
                    {counts.complaints.totalComplaints} Total | {counts.complaints.inProgressComplaints} In Progress | {counts.complaints.resolvedComplaints} Resolved
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rent Collections Card */}
          <div
            className="card hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: generateRandomColor() }}
          >
            <div className="card-body p-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{iconMapping.rentCollections}</div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Rent Collections</h3>
                  <p className="text-lg text-black">
                    {counts.rentCollections.totalRentCollections} Total | {counts.rentCollections.paidRentCollections} Paid | {counts.rentCollections.pendingRentCollections} Pending | {counts.rentCollections.overdueRentCollections} Overdue
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tenant Inventories Card */}
          <div
            className="card hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: generateRandomColor() }}
          >
            <div className="card-body p-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{iconMapping.tenantInventories}</div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Tenant Inventories</h3>
                  <p className="text-lg text-black">
                    {counts.tenantInventories.totalInventory} Total | {counts.tenantInventories.moveInInventories} Move In | {counts.tenantInventories.moveOutInventories} Move Out
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tenant Vehicles Card */}
          <div
            className="card hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: generateRandomColor() }}
          >
            <div className="card-body p-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{iconMapping.tenantVehicles}</div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Tenant Vehicles</h3>
                  <p className="text-lg text-black">{counts.tenantVehicles.totalVehicles} Total Vehicles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Parking Card */}
          <div
            className="card hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: generateRandomColor() }}
          >
            <div className="card-body p-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{iconMapping.parking}</div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Parking</h3>
                  <p className="text-lg text-black">
                    {counts.parking.totalParking} Total Parking | {counts.parking.onParking} On Parking
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tenant Payments Card */}
          <div
            className="card hover:shadow-xl transition-all transform hover:scale-105"
            style={{ backgroundColor: generateRandomColor() }}
          >
            <div className="card-body p-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{iconMapping.tenantPayments}</div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Tenant Payments</h3>
                  <p className="text-lg text-black">
                    {counts.tenantPayments.totalTenantPayments} Total | {counts.tenantPayments.pendingTenantPayments} Pending | {counts.tenantPayments.paidTenantPayments} Paid | {counts.tenantPayments.overdueTenantPayments} Overdue
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

export default TenantDashboard;
