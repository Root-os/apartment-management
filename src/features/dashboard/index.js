import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  FaHome,FaQuestionCircle
} from 'react-icons/fa';
import UnitStatusReport from './components/diagram';
import RemainingTenants from './components/tenDaysTenant'

const Dashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCounts(transformData(response.data));
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

  const transformData = (data) => {
    const transformedData = {};
    for (const [key, value] of Object.entries(data)) {
      transformedData[key] = {};
      for (const [subKey, subValue] of Object.entries(value)) {
        transformedData[key][keyMapping[subKey]] = subValue;
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
    terminatedTenants: 'Terminated Tenants',
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
    readEmails: 'Read Emails',
    totalEmployees: 'Total Employees',
    adminEmployees: 'Admin Employees',
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

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end">
        <button onClick={handleWrapToggle} className="text-xl">
          {isWrapped ? <FaCompress /> : <FaExpand />}
        </button>
      </div>
      <div
        className={`grid gap-4 ${
          isWrapped ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3'
        }`}
      >
       {counts && (
  <>
    {Object.keys(counts).map((key) => (
      <div
        key={key}
        className="card hover:shadow-xl transition-all transform hover:scale-105 relative"
        style={{ backgroundColor: generateRandomColor() }}
      >
        <div className="absolute top-2 left-2 flex items-center space-x-2">
          {/* Ensure iconMapping[key] is not undefined */}
          <div>{iconMapping[key] || <FaQuestionCircle size={30} title="Unknown" />}</div>
          
          {/* Ensure keyMapping[key] is not undefined */}
          <h3 className="text-xl font-semibold text-black">
            {keyMapping[key] || key} {/* Fallback to the key if no mapping found */}
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
  </>
)}

      </div>
      <hr className="my-6 border-t-2 border-dotted border-gray-500 dark:border-gray-300" />
      <div className="flex flex-wrap gap-4 ">
        
        <div className="flex-2  bg-white shadow-md rounded-lg dark:bg-gray-800">
          <UnitStatusReport />
        </div>
        <div className="flex-1  bg-white shadow-md rounded-lg dark:bg-gray-800">
          <RemainingTenants />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;