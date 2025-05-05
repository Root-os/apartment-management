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
  const [loading, setLoading] = useState(true); // Loading on mount
  const [error, setError] = useState('');
  const [isWrapped, setIsWrapped] = useState(false);
  const [startDate, setStartDate] = useState(''); // Empty initially
  const [endDate, setEndDate] = useState(''); // Empty initially

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

  // Initial data fetch on mount
  useEffect(() => {
    fetchData(); // No params to fetch full dataset
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
    fetchData(); // Fetch full dataset
  };

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
    notifications: <FaBell size={30} title="Notifications" />,
    paymentsRequest: <FaCreditCard size={30} title="Payments Request" />,
    complaints: <FaExclamationCircle size={30} title="Complaints" />,
    units: <FaBuilding size={30} title="Units" />,
    tenants: <FaUserFriends size={30} title="Tenants" />,
    tenantVehicles: <FaCar size={30} title="Tenant Vehicles" />,
    expenses: <FaDollarSign size={30} title="Expenses" />,
    emails: <FaEnvelope size={30} title="Emails" />,
    employees: <FaUser size={30} title="Employees" />,
    stockouts: <FaDolly size={30} title="Stockouts" />,
    tenantPayments: <FaMoneyBillAlt size={30} title="Tenant Payments" />,
    billPayments: <FaFileInvoiceDollar size={30} title="Bill Payments" />,
    rentCollections: <FaHome size={30} title="Rent Collections" />,
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
    return <div className="text-red-500">{error}</div>;
  }

  // console.log('Rendering counts:', counts);
  const CardWrapper = ({ children }) => {
    return (
      <div
        className={`
          bg-white dark:bg-gray-800
          shadow rounded-lg
          p-3 text-sm
          transition-all duration-300 ease-in-out
          max-h-[600px] overflow-hidden
          min-h-[80px]
        `}
      >
        {children}
      </div>
    );
  };
  

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end">
        {/* <button onClick={handleWrapToggle} className="text-xl">
          {isWrapped ? <FaCompress /> : <FaExpand />}
        </button> */}
      </div>
      <div className="flex flex-col sm:flex-row justify-end mb-4 gap-4 sm:gap-2">
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={handleDateChange}
          className="border p-2 w-full sm:w-auto"
          placeholder="Select start date"
        />
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={handleDateChange}
          className="border p-2 w-full sm:w-auto"
          placeholder="Select end date"
        />
        <button
          onClick={handleFilterClick}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          Filter
        </button>
        <button
          onClick={handleClearClick}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 w-full sm:w-auto"
        >
          Clear
        </button>
      </div>

      {counts ? (
        <div
          className={`grid gap-4 ${
            isWrapped ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3'
          }`}
        >
          {Object.keys(counts).map((key) => (
            <div
              key={key}
              className="card hover:shadow-xl transition-all transform hover:scale-105 relative"
              style={{ backgroundColor: generateRandomColor() }}
            >
              <div className="absolute top-2 left-2 flex items-center space-x-2">
                <div>{iconMapping[key] || <FaQuestionCircle size={30} title="Unknown" />}</div>
                <h3 className="text-xl font-semibold text-black">
                  {keyMapping[key] || key}
                </h3>
              </div>
              <div className="card-body p-6 mt-10">
                <ul className="text-sm text-black">
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
        <div className="text-gray-500">No data available</div>
      )}

{counts && (
  <>
    <hr className="my-6 border-t-2 border-dotted border-gray-500 dark:border-gray-300" />
    <div className="container mx-auto px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <CardWrapper>
            <RemainingTenants />
          </CardWrapper>
          <CardWrapper>
            <UnitStatusReport />
          </CardWrapper>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
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