import React, { useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';

const AssetAuditReport = () => {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data based on selected date
  const fetchDataByDate = async (selectedDate) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}asset-audits/date`, {
        date: selectedDate
      });
      return response.data.data;
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
      return response.data.data;
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
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data by status and date range", error);
      return [];
    }
  };

  // Clear all filter fields
  const clearFields = () => {
    setDate('');
    setStatus('');
    setStartDate('');
    setEndDate('');
  };

  // Handle filter button click
  const handleFilter = async () => {
    setLoading(true);
    let filteredData = [];

    if (startDate && endDate && status) {
      filteredData = await fetchDataByStatusAndDateRange(status, startDate, endDate);
    }
    else if (date) {
      filteredData = await fetchDataByDate(date);
    }
    else if (status) {
      filteredData = await fetchDataByStatus(status);
    }

    setData(filteredData);
    setLoading(false);
    clearFields();
  };

  const columns = [
    { key: 'asset_name', label: 'Asset Name' },
    {key: 'item_name', label: 'Item Name'},
    { key: 'existing_amount', label: 'Existing Amount' },
    { key: 'damaged_amount', label: 'Damaged Amount' },
    { key: 'lost_amount', label: 'Lost Amount' },
    { key: 'status', label: 'Status' },
    {
      label: 'Date',
      key: 'date',
      render: (row) => {
        return row.date ? new Date(row.date).toISOString().split('T')[0] : 'N/A';
      }
    },
  ];

  const handleDateChange = (event) => setDate(event.target.value);
  const handleStatusChange = (event) => setStatus(event.target.value);
  const handleStartDateChange = (event) => setStartDate(event.target.value);
  const handleEndDateChange = (event) => setEndDate(event.target.value);

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md w-full">
      <div className="flex justify-end items-center mb-4">
        <div className="flex flex-col space-y-4">
          {/* Filter Fields Row */}
          <div className="flex items-center space-x-2">
            {/* Date Picker (Single Date Filter) */}
            <div className="flex flex-col">
              <label htmlFor="date" className="text-sm font-medium">Audit Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={handleDateChange}
                className="bg-base-100 p-2 border rounded-md"
              />
            </div>

            {/* Status Dropdown (Single Status Filter) */}
            <div className="flex flex-col">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <select
                id="status"
                value={status}
                onChange={handleStatusChange}
                className="bg-base-100 p-2 border rounded-md"
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
                className="bg-base-100 p-2 border rounded-md"
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
                className="bg-base-100 p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Filter Button Row */}
          <div className="flex justify-end">
            <button
              onClick={handleFilter}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Filtering...' : 'Filter'}
            </button>
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