import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';
import SmartDateInput from '../../components/Common/smartDatePicker';
import { CalendarContext } from '../../context/calendarContext';
import api from '../../utils/api';


const ChargingReport = () => {
  const [chargingData, setChargingData] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [carList, setCarList] = useState([]);
  const [filterParams, setFilterParams] = useState({
    carPlate: '',
    carName: '',
    isTenant: false,
    tenantId: '',
    dateRange: '',
    startDate: '',
    endDate: '',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

const { formatDateForDisplay } = useContext(CalendarContext);

// Format function for table display
const formatDateTimeForTable = (isoString) => {
  if (!isoString) return 'N/A';
  
  try {
    const date = new Date(isoString);
    const datePart = formatDateForDisplay(isoString.split('T')[0]);
    const timePart = date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    return `${datePart} ${timePart}`;
  } catch (error) {
    return 'Invalid Date';
  }
};


  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}tenant`);
        setTenants(response.data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        setMessage('Error fetching tenants. Please try again.');
        setMessageType('error');
        setIsModalOpen(true);
      }
    };

    const fetchUniqueTenants = async () => {
      try {
        const response = await api.get("tenant/floor-units");
        const tenants = [];

        response.data.forEach((t) => {
          // Pick the first tenant record for this phone number
          if (t.tenant?.length > 0) {
            tenants.push({
              phoneNumber: t.phoneNumber,
              fullName: t.fullName,
              tenantId: t.tenant[0].tenantId, // first lease tenantId
            });
          }
        });

        setTenants(tenants);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    const fetchCarList = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}charging`);
        setCarList(response.data);
      } catch (error) {
        console.error('Error fetching car list:', error);
        setMessage('Error fetching car list. Please try again.');
        setMessageType('error');
        setIsModalOpen(true);
      }
    };

    Promise.all([fetchTenants(), fetchCarList(), fetchUniqueTenants()]).finally(() => setLoading(false));
  }, []);

  // Handle filter submit
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate date range
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setMessage('End date must be after start date.');
      setMessageType('error');
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }

    // Format dateRange as "start,end" in ISO 8601
    let dateRange = '';
    if (startDate && endDate) {
      const start = new Date(startDate).toISOString();
      const end = new Date(new Date(endDate).setHours(23, 59, 59, 999)).toISOString();
      dateRange = `${start},${end}`;
    }

    const params = { ...filterParams, dateRange };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}charging/report`, params);
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setChargingData(data);
     
    } catch (error) {
      const message =
        error.response?.status === 404
          ? 'No charging data found with the given filters.'
          : 'Error filtering data. Please try again.';
   
    } finally {
      setIsLoading(false);
    }
  };

const handleResetFilters = () => {
  setFilterParams({
    carPlate: '',
    carName: '',
    isTenant: false,
    tenantId: '',
    dateRange: '',
    startDate: '',
    endDate: '',
  });


  setStartDate('');
  setEndDate('');
  setChargingData([]);
};


 const columns = [
  { key: 'carPlate', label: 'Car Plate' },
  { key: 'carName', label: 'Car Name' },
  {
    key: 'chargingStartTime',
    label: 'Charging Start Time',
    render: (data) => formatDateTimeForTable(data.chargingStartTime),
  },
  { key: 'status', label: 'Status' },
  { key: 'chargingCost', label: 'Charging Cost' },
  
  {
    key: 'name',
    label: 'Name',
    render: (data) => {
      if (data.isTenant) {
        return data.Tenant?.fullName || 'Unknown Tenant';
      } else {
        return data.driverName || 'Unknown Driver';
      }
    },
  },
];


  return (
    <div className="container mx-auto p-4">
      {/* Filter form */}
      <form onSubmit={handleFilterSubmit} className="grid grid-cols-4 gap-4">
        <div>
          <label htmlFor="carPlate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Car Plate
          </label>
          <select
            id="carPlate"
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            value={filterParams.carPlate}
            onChange={(e) => setFilterParams({ ...filterParams, carPlate: e.target.value })}
          >
            <option value="">Select Car Plate</option>
            {carList.map((car) => (
              <option key={car.id} value={car.carPlate}>
                {car.carPlate}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="carName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Car Name
          </label>
          <select
            id="carName"
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            value={filterParams.carName}
            onChange={(e) => setFilterParams({ ...filterParams, carName: e.target.value })}
          >
            <option value="">Select Car Name</option>
            {carList.map((car) => (
              <option key={car.id} value={car.carName}>
                {car.carName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <SmartDateInput
            id="startDate"
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            value={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <SmartDateInput
            id="endDate"
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            value={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isTenant"
            checked={filterParams.isTenant}
            onChange={(e) => setFilterParams({ ...filterParams, isTenant: e.target.checked })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="isTenant" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Is Tenant?
          </label>
        </div>

        {filterParams.isTenant && (
          <div>
            <label htmlFor="tenantId" className="dark:text-gray-300 block text-sm font-medium text-gray-700">
              Tenant
            </label>
            <select
              id="tenantId"
              name="tenantId"
              value={filterParams.tenantId || ""}
              onChange={(e) => setFilterParams(prev => ({ ...prev, tenantId: e.target.value }))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.tenantId} value={tenant.tenantId}>
                  {tenant.fullName} ({tenant.phoneNumber})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="col-span-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Reset
            </button>
          <button
            type="submit"
            className="w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Filter Data'}
          </button>
        </div>
      </form>

      {/* Table for displaying charging report */}
      {loading ? (
        <LoadingComponent />
      ) : (
        <TableComponent
          title="Charging Report"
          data={chargingData || []}
          columns={columns}
         rowsPerPageOptions={[5, 10, 15]}

          showSearch={true}
          exportable={true}
          exportConfig={[
  {
    label: "Car Plate",
    getValue: (r) => r.carPlate ?? "N/A",
  },
  {
    label: "Car Name",
    getValue: (r) => r.carName ?? "N/A",
  },
  {
    label: "Charging Start Time",
    getValue: (r) =>
      r.chargingStartTime
        ? new Date(r.chargingStartTime).toLocaleString()
        : "N/A",
  },
  {
    label: "Status",
    getValue: (r) => r.status ?? "N/A",
  },
  {
    label: "Charging Cost",
    getValue: (r) => r.chargingCost ?? 0,
  },
  {
    label: "Name",
    getValue: (r) => {
      if (r.isTenant) {
        return r.Tenant?.fullName ?? "Unknown Tenant";
      }
      return r.driverName ?? "Unknown Driver";
    },
  },
]}
        />
      )}

      {/* Modal for displaying messages */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          messageType={messageType}
          message={message}
        />
      )}
    </div>
  );
};

export default ChargingReport;