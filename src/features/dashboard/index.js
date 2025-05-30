import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingComponent from '../../components/loading';
import {
  FaBell,
  FaCreditCard,
  FaExclamationCircle,
  FaExpand,
  FaCompress,
  FaBuilding,
  FaUserFriends,
  FaCar,
  FaDollarSign,
  FaEnvelope,
  FaUser,
  FaDolly,
  FaMoneyBillAlt,
  FaFileInvoiceDollar,
  FaHome,
  FaQuestionCircle,
} from 'react-icons/fa';
import UnitStatusReport from './components/diagram';
import RemainingTenants from './components/tenDaysTenant';
import LowStockAlert from './components/lowStockAlert';
import RecentComplaintList from './components/recentComplent';

const Dashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWrapped, setIsWrapped] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = async (params = {}) => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log('Request URL:', `${process.env.REACT_APP_BASE_URL}dashboard`, params);

      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
        params,
      });
      console.log('Raw response:', response.data);
      const transformed = transformData(response.data);
      console.log('Transformed data:', transformed);
      setCounts(transformed);
    } catch (error) {
      setError('Error loading data: ' + error.message);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterClick = () => {
    if (!startDate && !endDate) {
      setError('Please select at least one date to filter');
      return;
    }
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    fetchData(params);
  };

  const handleClearClick = () => {
    setStartDate('');
    setEndDate('');
    setError('');
    fetchData();
  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 100);
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const transformData = (data) => {
    const transformedData = {};
    for (const [key, value] of Object.entries(data)) {
      transformedData[key] = {};
      for (const [subKey, subValue] of Object.entries(value)) {
        transformedData[key][keyMapping[subKey] || subKey] = subValue;
      }
    }
    return transformedData;
  };

  const keyMapping = {
    totalNotifications: 'Total Notifications',
    sentNotifications: 'Sent Notifications',
    readNotifications: 'Read Notifications',
    totalPaymentsRequest: 'Total Payments Request',
    pendingPaymentsRequest: 'Pending Payments Request',
    completedPaymentsRequest: 'Completed Payments Request',
    totalComplaints: 'Total Complaints',
    inProgressComplaints: 'In-Progress Complaints',
    resolvedComplaints: 'Resolved Complaints',
    notResolvedComplaints: 'Not Resolved Complaints',
    totalUnits: 'Total Units',
    availableUnits: 'Available Units',
    occupiedUnits: 'Occupied Units',
    underMaintenanceUnits: 'Under Maintenance Units',
    totalFloors: 'Total Floors',
    availableFloors: 'Available Floors',
    underMaintenanceFloors: 'Under Maintenance Floors',
    totalTenants: 'Total Tenants',
    activeTenants: 'Active Tenants',
    inactiveTenants: 'Inactive Tenants',
    totalVehicles: 'Total Vehicles',
    totalInventory: 'Total Inventory',
    moveInInventories: 'Move-In Inventories',
    moveOutInventories: 'Move-Out Inventories',
    totalParking: 'Total Parking',
    onParking: 'On Parking',
    readyToOut: 'Ready To Out',
    completed: 'Completed',
    totalExpenses: 'Total Expenses',
    totalItems: 'Total Items',
    totalPurchasedItems: 'Total Purchased Items',
    totalExistedItems: 'Total Existed Items',
    alertNumberOfItems: 'Alert Number Of Items',
    totalWithdrawals: 'Total Withdrawals',
    pendingWithdrawals: 'Pending Withdrawals',
    approvedWithdrawals: 'Approved Withdrawals',
    rejectedWithdrawals: 'Rejected Withdrawals',
    processedWithdrawals: 'Processed Withdrawals',
    totalEmails: 'Total Emails',
    sentEmails: 'Sent Emails',
    totalEmployees: 'Total Employees',
    totalSalaries: 'Total Salaries',
    pendingSalaries: 'Pending Salaries',
    paidSalaries: 'Paid Salaries',
    totalStockouts: 'Total Stockouts',
    pendingStockouts: 'Pending Stockouts',
    completedStockouts: 'Completed Stockouts',
    rejectedStockouts: 'Rejected Stockouts',
    totalTenantPayments: 'Total Tenant Payments',
    pendingTenantPayments: 'Pending Tenant Payments',
    paidTenantPayments: 'Paid Tenant Payments',
    overdueTenantPayments: 'Overdue Tenant Payments',
    totalBillPayments: 'Total Bill Payments',
    pendingBillPayments: 'Pending Bill Payments',
    paidBillPayments: 'Paid Bill Payments',
    overdueBillPayments: 'Overdue Bill Payments',
    totalRentCollections: 'Total Rent Collections',
    paidRentCollections: 'Paid Rent Collections',
    pendingRentCollections: 'Pending Rent Collections',
    overdueRentCollections: 'Overdue Rent Collections',
  };

const iconMapping = {
  notifications: <FaBell className="text-white text-5xl" title="Notifications" />,
  paymentsRequest: <FaCreditCard className="text-white text-5xl" title="Payments Request" />,
  complaints: <FaExclamationCircle className="text-white text-5xl" title="Complaints" />,
  units: <FaBuilding className="text-white text-5xl" title="Units" />,
  tenants: <FaUserFriends className="text-white text-5xl" title="Tenants" />,
  tenantVehicles: <FaCar className="text-white text-5xl" title="Tenant Vehicles" />,
  expenses: <FaDollarSign className="text-white text-5xl" title="Expenses" />,
  emails: <FaEnvelope className="text-white text-5xl" title="Emails" />,
  employees: <FaUser className="text-white text-5xl" title="Employees" />,
  stockouts: <FaDolly className="text-white text-5xl" title="Stockouts" />,
  tenantPayments: <FaMoneyBillAlt className="text-white text-5xl" title="Tenant Payments" />,
  billPayments: <FaFileInvoiceDollar className="text-white text-5xl" title="Bill Payments" />,
  rentCollections: <FaHome className="text-white text-5xl" title="Rent Collections" />,
};

  const handleWrapToggle = () => {
    setIsWrapped(!isWrapped);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to:`, value);
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }
  if (error) {
    return <div className="text-red-500 text-xl">{error}</div>;
  }

  const CardWrapper = ({ children }) => {
    return (
      <div
        className={`
          bg-white dark:bg-gray-800
          shadow rounded-lg
          p-4 text-base
          transition-all duration-300 ease-in-out
          max-h-[600px] overflow-hidden
          min-h-[100px]
        `}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button onClick={handleWrapToggle} className="text-2xl">
          {isWrapped ? <FaCompress size={24} /> : <FaExpand size={24} />}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-end mb-6 gap-4 sm:gap-3">
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={handleDateChange}
          className="border p-3 text-base w-full sm:w-auto rounded-md"
          placeholder="Select start date"
        />
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={handleDateChange}
          className="border p-3 text-base w-full sm:w-auto rounded-md"
          placeholder="Select end date"
        />
        <button
          onClick={handleFilterClick}
          className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 text-base w-full sm:w-auto"
        >
          Filter
        </button>
        <button
          onClick={handleClearClick}
          className="bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600 text-base w-full sm:w-auto"
        >
          Clear
        </button>
      </div>

      {counts ? (
        <div
          className={`grid gap-6 ${
            isWrapped ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3'
          }`}
        >
          {Object.keys(counts).map((key) => (
            <div
              key={key}
              className="card hover:shadow-xl transition-all transform hover:scale-105 relative"
              style={{ backgroundColor: generateRandomColor() }}
            >
              <div className="absolute top-3 left-3 flex items-center space-x-3">
                <div>{iconMapping[key] || <FaQuestionCircle className="text-white text-5xl" title="Unknown" />}</div>
                <h3 className="text-2xl font-semibold text-white">
                  {keyMapping[key] || key}
                </h3>
              </div>
              <div className="card-body p-8 mt-12">
                <ul className="text-l text-white font-bold">
                  {Object.keys(counts[key]).map((subKey) => (
                    <li key={subKey}>
                      {subKey}: {counts[key][subKey]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-xl">No data available</div>
      )}

      {counts && (
        <>
          <hr className="my-8 border-t-2 border-dotted border-gray-500 dark:border-gray-300" />
          <div className="container mx-auto px-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="flex flex-col gap-6">
                <CardWrapper>
                  <RemainingTenants />
                </CardWrapper>
                <CardWrapper>
                  <UnitStatusReport />
                </CardWrapper>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6">
                <CardWrapper>
                  <LowStockAlert />
                </CardWrapper>
                <CardWrapper>
                  <RecentComplaintList />
                </CardWrapper>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;