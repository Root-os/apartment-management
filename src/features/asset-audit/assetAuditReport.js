import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';

const AssetAuditReport = () => {
  const [date, setDate] = useState(''); // Default date (empty)
  const [status, setStatus] = useState(''); // Default status filter to 'confirmed'
  const [startDate, setStartDate] = useState(''); // For date range start date
  const [endDate, setEndDate] = useState(''); // For date range end date
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data based on selected date
  const fetchDataByDate = async (selectedDate) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}asset-audits/date`, {
        date: selectedDate
      });
      return response.data.data; // Return the data for the selected date
    } catch (error) {
      console.error("Error fetching data by date", error);
      return [];
    }
  };

  // Fetch data based on selected status
  const fetchDataByStatus = async (selectedStatus) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}asset-audits/status`, {
        status: selectedStatus
      });
      return response.data.data; // Return the data for the selected status
    } catch (error) {
      console.error("Error fetching data by status", error);
      return [];
    }
  };

  // Fetch data based on selected date range and status
  const fetchDataByStatusAndDateRange = async (selectedStatus, selectedStartDate, selectedEndDate) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}asset-audits/status/date-range`, {
        status: selectedStatus,
        startDate: selectedStartDate,
        endDate: selectedEndDate
      });
      return response.data.data; // Return the data for the selected status and date range
    } catch (error) {
      console.error("Error fetching data by status and date range", error);
      return [];
    }
  };

  // Call the API functions whenever date, startDate, endDate, or status changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading

      let filteredData = [];

      // If both date range and status are provided, fetch data based on both
      if (startDate && endDate && status) {
        filteredData = await fetchDataByStatusAndDateRange(status, startDate, endDate);
      }
      // If only date is provided
      else if (date) {
        filteredData = await fetchDataByDate(date);
      }
      // If only status is provided
      else if (status) {
        filteredData = await fetchDataByStatus(status);
      }

      setData(filteredData); // Set the filtered data
      setLoading(false); // Stop loading
    };

    fetchData();
  }, [date, status, startDate, endDate]);

  const columns = [
    { key: 'asset_name', label: 'Asset Name' },
    { key: 'existing_amount', label: 'Existing Amount' },
    { key: 'damaged_amount', label: 'Damaged Amount' },
    { key: 'lost_amount', label: 'Lost Amount' },
    { key: 'status', label: 'Status' },
    {
        label: 'Date',
        key: 'date',
        render: (row) => {
          // Convert the ISO date string to just YYYY-MM-DD format
          return row.date ? new Date(row.date).toLocaleDateString('en-CA') : 'N/A';
          // 'en-CA' gives YYYY-MM-DD format. You can use other locales like:
          // 'en-US' for MM/DD/YYYY
          // 'en-GB' for DD/MM/YYYY
        }
    },
  ];

  const handleDateChange = (event) => {
    setDate(event.target.value); // Update the date filter
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value); // Update the status filter
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value); // Update the start date filter
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value); // Update the end date filter
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md w-full">

      <div className="flex justify-end items-center mb-4">
  {/* <h2 className="text-2xl font-bold">Filter Data</h2> */}
        <div className="flex items-center space-x-2">
            {/* Date Picker (Single Date Filter) */}
            <div className="flex flex-col">
            <label htmlFor="date" className="text-sm font-medium">Audit Date</label>
            <input
                id="date"
                type="date"
                value={date}
                onChange={handleDateChange}
                className="p-2 border rounded-md"
            />
            </div>

            {/* Status Dropdown (Single Status Filter) */}
            <div className="flex flex-col">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <select
                id="status"
                value={status} // The default value will be set as 'confirmed'
                onChange={handleStatusChange}
                className="p-2 border rounded-md"
            >
                <option value="">Select Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="fail">Fail</option>
                <option value="to_be_checked">To be Checked</option>
            </select>
            </div>

            {/* Start Date Picker (Date Range Filter) */}
            <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm font-medium">Audit date from</label>
            <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="p-2 border rounded-md"
            />
            </div>

            {/* End Date Picker (Date Range Filter) */}
            <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm font-medium">Audit date to</label>
            <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="p-2 border rounded-md"
            />
            </div>
        </div>
        </div>

      {loading ? (
       <LoadingComponent/>
      ) : (
        <TableComponent 
          title="Asset Audit Reports" 
          data={data} 
          columns={columns} 
        />
      )}
    </div>
  );
};

export default AssetAuditReport;
