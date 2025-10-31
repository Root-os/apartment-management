import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import SmartDateInput from '../../components/Common/smartDatePicker';

const AssetAuditReport = () => {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [itemId, setItemId] = useState('');
  const [assetTypeId, setAssetTypeId] = useState('');
  const [items, setItems] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch dropdown options on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [itemsRes, assetTypesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}items`),
          axios.get(`${process.env.REACT_APP_BASE_URL}asset`)
        ]);
        setItems(itemsRes.data); // items is an array
        setAssetTypes(assetTypesRes.data.data); // assetTypes is inside .data
      } catch (error) {
        console.error("Error fetching dropdown data", error);
      }
    };

    fetchDropdownData();
  }, []);

  const clearFields = () => {
    setDate('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setItemId('');
    setAssetTypeId('');
  };

  const handleFilter = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}asset-audits/status/date-range`, {
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        itemId: itemId || undefined,
        assetTypeId: assetTypeId || undefined,
      });

      setData(response.data.data);
    } catch (error) {
      console.error("Error filtering data", error);
      setData([]);
    }

    setLoading(false);
  };

  const columns = [
    {
      label: 'Name',
      key: 'name',
      render: (row) => {
        if (row.Item) return row.Item.itemName;
        if (row.AssetType) return row.AssetType.name;
        return 'N/A';
      }
    },
    {
      label: 'Type',
      key: 'type',
      render: (row) => {
        if (row.Item) return 'Item';
        if (row.AssetType) return 'Asset';
        return 'Unknown';
      }
    },
    { label: 'Existing', key: 'existing_amount' },
    { label: 'Status', key: 'status' },
    {
      label: 'Date',
      key: 'date',
      isDate: true
    },
  ];

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md w-full">
      <div className="flex justify-end items-center mb-4">
        <div className="bg-base-100 p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
  {/* <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter Audit Reports</h2> */}

  {/* Horizontal Fields Row */}
  <div className="flex flex-wrap gap-4">
    {/* Status */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-white-600">Status</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-48 rounded-xl border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
      >
        <option value="">Select Status</option>
        <option value="confirmed">Confirmed</option>
        <option value="fail">Fail</option>
        <option value="to_be_checked">To be Checked</option>
      </select>
    </div>

    {/* Item */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-white-600">Item</label>
      <select
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        className="w-48 rounded-xl border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
      >
        <option value="">Select Item</option>
        {items.map(item => (
          <option key={item.id} value={item.id}>{item.itemName}</option>
        ))}
      </select>
    </div>

    {/* Asset Type */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-white-600">Asset Type</label>
      <select
        value={assetTypeId}
        onChange={(e) => setAssetTypeId(e.target.value)}
        className="w-48 rounded-xl border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
      >
        <option value="">Select Asset Type</option>
        {assetTypes.map(asset => (
          <option key={asset.id} value={asset.id}>{asset.name}</option>
        ))}
      </select>
    </div>

      {/* Audit Date */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-white-600">Audit Date</label>
      <SmartDateInput
        value={date}
        onChange={(date) => setDate(date)}
        className="w-40 rounded-xl border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
      />
    </div>

    {/* Start Date */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-white-600">Audited Date From</label>
      <SmartDateInput
        value={startDate}
        onChange={(date) => setStartDate(date)}
        className="w-40 rounded-xl border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
      />
    </div>

    {/* End Date */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-white-600">Audited Date To</label>
      <SmartDateInput
        value={endDate}
        onChange={(date) => setEndDate(date)}
        className="w-40 rounded-xl border-gray-300 shadow-sm focus:ring focus:ring-blue-200"
      />
    </div>
  </div>

  {/* Buttons Below */}
  <div className="flex justify-end gap-3 mt-6">
    <button
      onClick={clearFields}
      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
    >
      Clear
    </button>
    <button
      onClick={handleFilter}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
    >
      {loading ? 'Filtering...' : 'Filter'}
    </button>
  </div>
</div>

      </div>

      {loading ? (
        <LoadingComponent />
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
