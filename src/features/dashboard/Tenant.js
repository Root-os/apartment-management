import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaBell,
  FaCreditCard,
  FaExclamationCircle,
  FaHome,
  FaCar,
  FaParking,
} from 'react-icons/fa';
import Loading from '../../components/loading';

// Function to generate a random dark HSL color
const getDarkColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 20); // 60–80%
  const lightness = 20 + Math.floor(Math.random() * 10); // 20–30%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const TenantDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Generate dark colors for each card
  const cardColors = {
    notifications: getDarkColor(),
    paymentsRequest: getDarkColor(),
    complaints: getDarkColor(),
    rentCollections: getDarkColor(),
    tenantInventories: getDarkColor(),
    tenantVehicles: getDarkColor(),
    parking: getDarkColor(),
    tenantPayments: getDarkColor(),
  };

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
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const iconStyle = 'text-white text-5xl';

  const iconMapping = {
    notifications: <FaBell className={iconStyle} />,
    paymentsRequest: <FaCreditCard className={iconStyle} />,
    complaints: <FaExclamationCircle className={iconStyle} />,
    rentCollections: <FaHome className={iconStyle} />,
    tenantInventories: <FaHome className={iconStyle} />,
    tenantVehicles: <FaCar className={iconStyle} />,
    parking: <FaParking className={iconStyle} />,
    tenantPayments: <FaCreditCard className={iconStyle} />,
  };

  if (loading) return <div><Loading /></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      {counts && (
        <>
          {/* Notifications Card */}
          <div className="rounded-2xl p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{ backgroundColor: cardColors.notifications }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{iconMapping.notifications}</div>
              <div>
                <h3 className="text-xl font-bold text-white">Notifications</h3>
                <p className="text-base font-bold text-white mt-1">
                  {counts.notifications.totalNotifications} Total | {counts.notifications.unreadNotifications} Unread
                </p>
              </div>
            </div>
          </div>

          {/* Payments Requests Card */}
          <div className="rounded-2xl p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{ backgroundColor: cardColors.paymentsRequest }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{iconMapping.paymentsRequest}</div>
              <div>
                <h3 className="text-xl font-bold text-white">Payments Requests</h3>
                <p className="text-base font-bold text-white mt-1">
                  {counts.paymentsRequest.totalPaymentsRequest} Total | {counts.paymentsRequest.pendingPaymentsRequest} Pending | {counts.paymentsRequest.completedPaymentsRequest} Completed
                </p>
              </div>
            </div>
          </div>

          {/* Complaints Card */}
          <div className="rounded-2xl p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{ backgroundColor: cardColors.complaints }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{iconMapping.complaints}</div>
              <div>
                <h3 className="text-xl font-bold text-white">Complaints</h3>
                <p className="text-base font-bold text-white mt-1">
                  {counts.complaints.totalComplaints} Total | {counts.complaints.inProgressComplaints} In Progress | {counts.complaints.resolvedComplaints} Resolved
                </p>
              </div>
            </div>
          </div>

          {/* Rent Collections Card */}
          <div className="rounded-2xl p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{ backgroundColor: cardColors.rentCollections }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{iconMapping.rentCollections}</div>
              <div>
                <h3 className="text-xl font-bold text-white">Rent Collections</h3>
                <p className="text-base font-bold text-white mt-1">
                  {counts.rentCollections.totalRentCollections} Total | {counts.rentCollections.paidRentCollections} Paid | {counts.rentCollections.pendingRentCollections} Pending | {counts.rentCollections.overdueRentCollections} Overdue
                </p>
              </div>
            </div>
          </div>

          {/* Tenant Inventories Card */}
          <div className="rounded-2xl p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{ backgroundColor: cardColors.tenantInventories }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{iconMapping.tenantInventories}</div>
              <div>
                <h3 className="text-xl font-bold text-white">Tenant Inventories</h3>
                <p className="text-base font-bold text-white mt-1">
                  {counts.tenantInventories.totalInventory} Total | {counts.tenantInventories.moveInInventories} Move In | {counts.tenantInventories.moveOutInventories} Move Out
                </p>
              </div>
            </div>
          </div>

          {/* Tenant Vehicles Card */}
          <div className="rounded-2xl p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{ backgroundColor: cardColors.tenantVehicles }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{iconMapping.tenantVehicles}</div>
              <div>
                <h3 className="text-xl font-bold text-white">Tenant Vehicles</h3>
                <p className="text-base font-bold text-white mt-1">{counts.tenantVehicles.totalVehicles} Total Vehicles</p>
              </div>
            </div>
          </div>

          {/* Parking Card */}
          <div className="rounded-2xl p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{ backgroundColor: cardColors.parking }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{iconMapping.parking}</div>
              <div>
                <h3 className="text-xl font-bold text-white">Parking</h3>
                <p className="text-base font-bold text-white mt-1">
                  {counts.parking.totalParking} Total Parking | {counts.parking.onParking} On Parking
                </p>
              </div>
            </div>
          </div>

          {/* Tenant Payments Card */}
          <div className="rounded-2xl p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{ backgroundColor: cardColors.tenantPayments }}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{iconMapping.tenantPayments}</div>
              <div>
                <h3 className="text-xl font-bold text-white">Tenant Payments</h3>
                <p className="text-base font-bold text-white mt-1">
                  {counts.tenantPayments.totalTenantPayments} Total | {counts.tenantPayments.pendingTenantPayments} Pending | {counts.tenantPayments.paidTenantPayments} Paid | {counts.tenantPayments.overdueTenantPayments} Overdue
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TenantDashboard;
