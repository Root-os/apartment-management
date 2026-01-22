import React, { useEffect, useState } from 'react';
import {
  FaBell,
  FaCreditCard,
  FaExclamationCircle,
  FaHome,
  FaEnvelope,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
} from 'react-icons/fa';
import Loading from '../../components/loading';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const getDarkColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 25%)`;
};

const TenantDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const navigate = useNavigate();

  const colors = {
    units: getDarkColor(),
    notifications: getDarkColor(),
    payments: getDarkColor(),
    complaints: getDarkColor(),
    inventories: getDarkColor(),
    letters: getDarkColor(),
    tenantPayments: getDarkColor(),
    tenantRent: getDarkColor(),
  };

  const fetchDashboard = async (start, end) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      let url = 'dashboard/for-tenant';
      if (start && end) url += `?startDate=${start}&endDate=${end}`;
      else if (start) url += `?startDate=${start}`;
      else if (end) url += `?endDate=${end}`;

      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load tenant dashboard');
    } finally {
      setLoading(false);
    }
  };

  // fetch dashboard on initial load
  useEffect(() => {
    fetchDashboard('', '');
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Date Filter */}
      <div className="flex gap-2 mb-4 items-end">
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => fetchDashboard(startDate, endDate)}
          >
            Filter
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setStartDate('');
              setEndDate('');
              fetchDashboard('', '');
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Units Occupied */}
        <div
          className="rounded-2xl p-6 text-white"
          style={{ backgroundColor: colors.units }}
          onClick={() => navigate('/app/units')}
        >
          <div className="flex gap-4">
            <FaHome className="text-5xl" />
            <div>
              <h3 className="text-xl font-bold">Units Occupied</h3>
              <ul className="mt-2 text-sm space-y-1">
                {data.unitsOccupied.map((unit) => (
                  <li key={unit.unitId}>
                    Unit {unit.unitNumber} — Floor {unit.floorNumber}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div
          className="rounded-2xl p-6 text-white"
          style={{ backgroundColor: colors.notifications }}
          onClick={() => navigate('/app/my-notification')}
        >
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

        {/* Complaints */}
        <div
          className="rounded-2xl p-6 text-white"
          style={{ backgroundColor: colors.complaints }}
          onClick={() => navigate('/app/complain-tenant-view')}
        >
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

        {/* Tenant Inventories */}
        <div
          className="rounded-2xl p-6 text-white"
          style={{ backgroundColor: colors.inventories }}
          onClick={() => navigate('/app/tenant-view-in')}
        >
          <div className="flex gap-4">
            <FaHome className="text-5xl" />
            <div>
              <h3 className="text-xl font-bold">Inventories</h3>
              <p className="mt-2 text-sm">
                Move In: {data.tenantInventories.moveIn.totalItems} items,{' '}
                {data.tenantInventories.moveIn.totalQuantity} total quantity
              </p>
              <p className="mt-1 text-sm">
                Move Out: {data.tenantInventories.moveOut.totalItems} items,{' '}
                {data.tenantInventories.moveOut.totalQuantity} total quantity
              </p>
            </div>
          </div>
        </div>

        {/* Payment Requests */}
        <div
          className="rounded-2xl p-6 text-white"
          style={{ backgroundColor: colors.payments }}
          onClick={() => navigate('/app/payment-request-history')}
        >
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

        {/* Tenant Payments */}
        <div
          className="rounded-2xl p-6 text-white"
          style={{ backgroundColor: colors.tenantPayments }}
          onClick={() => navigate('/app/tenant-payment-history')}
        >
          <div className="flex gap-4">
            <FaMoneyBillWave className="text-5xl" />
            <div>
              <h3 className="text-xl font-bold">Tenant Payments</h3>
              <p className="mt-2 text-sm">{data.tenantPayments.totalTenantPayments} Total</p>
              <p className="text-sm">
                {data.tenantPayments.pendingTenantPayments} Pending |{' '}
                {data.tenantPayments.paidTenantPayments} Paid |{' '}
                {data.tenantPayments.overdueTenantPayments} Overdue
              </p>
            </div>
          </div>
        </div>

        {/* Letters */}
        <div
          className="rounded-2xl p-6 text-white"
          style={{ backgroundColor: colors.letters }}
          onClick={() => navigate('/app/my-letter')}
        >
          <div className="flex gap-4">
            <FaEnvelope className="text-5xl" />
            <div>
              <h3 className="text-xl font-bold">Letters</h3>
              <p className="mt-2 text-sm">{data.letters.totalLetters} Total</p>
              <p className="text-sm">
                {data.letters.sentLetters} Sent | {data.letters.receivedLetters} Received |{' '}
                {data.letters.rejectedLetters} Rejected
              </p>
            </div>
          </div>
        </div>

        {/* Tenant Rent Collection */}
        <div
          className="rounded-2xl p-6 text-white"
          style={{ backgroundColor: colors.tenantRent }}
          onClick={() => navigate('/app/tenant-rent-collection')}
        >
          <div className="flex gap-4">
            <FaFileInvoiceDollar className="text-5xl" />
            <div>
              <h3 className="text-xl font-bold">Rent Collection</h3>
              <p className="mt-2 text-sm">
                {data.tenantRentCollection.totalTenantRentCollection} Total
              </p>
              <p className="text-sm">
                {data.tenantRentCollection.pendingTenantRentCollection} Pending |{' '}
                {data.tenantRentCollection.paidTenantRentCollection} Paid
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
