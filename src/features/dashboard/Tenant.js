import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaBell,
  FaCreditCard,
  FaExclamationCircle,
  FaHome,
  FaCar,
} from 'react-icons/fa';
import Loading from '../../components/loading';
import { useNavigate } from 'react-router-dom';


// Dark color generator
const getDarkColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 25%)`;
};

const TenantDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const colors = {
    units: getDarkColor(),
    notifications: getDarkColor(),
    payments: getDarkColor(),
    complaints: getDarkColor(),
    inventories: getDarkColor(),
    vehicles: getDarkColor(),
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/dashboard/for-tenant`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load tenant dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

      {/* Units Occupied */}
      <div className="rounded-2xl p-6 text-white" 
           style={{ backgroundColor: colors.units }}
           onClick={()=> navigate('')}>
        <div className="flex gap-4">
          <FaHome className="text-5xl" />
          <div>
            <h3 className="text-xl font-bold">Units Occupied</h3>
            <ul className="mt-2 text-sm space-y-1">
              {data.unitsOccupied.map(unit => (
                <li key={unit.unitId}>
                  Unit {unit.unitNumber} — Floor {unit.floorNumber}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: colors.notifications }} 
           onClick={()=> navigate('/app/my-notification')}>
        <div className="flex gap-4">
          <FaBell className="text-5xl" />
          <div>
            <h3 className="text-xl font-bold">Notifications</h3>
            <p className="mt-2">
              {data.notifications.totalNotifications} Total |{' '}
              {data.notifications.unreadNotifications} Unread
            </p>
          </div>
        </div>
      </div>

      {/* Payment Requests */}
      <div className="rounded-2xl p-6 text-white" 
           style={{ backgroundColor: colors.payments }}
           onClick={()=> navigate('/app/payment-request-history')}>
        <div className="flex gap-4">
          <FaCreditCard className="text-5xl" />
          <div>
            <h3 className="text-xl font-bold">Payment Requests</h3>
            <p className="mt-2">
              {data.paymentsRequest.totalPaymentsRequest} Total |{' '}
              {data.paymentsRequest.pendingPaymentsRequest} Pending
            </p>
          </div>
        </div>
      </div>

      {/* Complaints */}
      <div className="rounded-2xl p-6 text-white" 
           style={{ backgroundColor: colors.complaints }}
           onClick={()=> navigate('/app/complain-tenant-view')}>
        <div className="flex gap-4">
          <FaExclamationCircle className="text-5xl" />
          <div>
            <h3 className="text-xl font-bold">Complaints</h3>
            <p className="mt-2">
              {data.complaints.totalComplaints} Total |{' '}
              {data.complaints.inProgressComplaints} In Progress
            </p>
          </div>
        </div>
      </div>

      {/* Inventories */}
      <div className="rounded-2xl p-6 text-white" 
           style={{ backgroundColor: colors.inventories }}
           onClick={()=> navigate('/app/tenant-view-in')}>
        <div className="flex gap-4">
          <FaHome className="text-5xl" />
          <div>
            <h3 className="text-xl font-bold">Inventories</h3>
            <p className="mt-2">
              {data.tenantInventories.totalInventory} Total
            </p>
          </div>
        </div>
      </div>

      {/* Vehicles */}
      <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: colors.vehicles }}>
        <div className="flex gap-4">
          <FaCar className="text-5xl" />
          <div>
            <h3 className="text-xl font-bold">Vehicles</h3>
            <p className="mt-2">
              {data.tenantVehicles.totalVehicles} Registered
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TenantDashboard;
