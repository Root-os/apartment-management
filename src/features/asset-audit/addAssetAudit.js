import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';


const AddAssetAuditPage = () => {
  const [items, setItems] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedAssetTypeId, setSelectedAssetTypeId] = useState('');
  const [assetName, setAssetName] = useState('');
  const [date, setDate] = useState('');
  const [existingAmount, setExistingAmount] = useState('');
  const [damagedAmount, setDamagedAmount] = useState('');
  const [lostAmount, setLostAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isAssetSelected, setIsAssetSelected] = useState(false);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch items and asset types
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}items`)
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });

    axios.get(`${process.env.REACT_APP_BASE_URL}asset`)
      .then(response => {
        setAssetTypes(response.data.data); // Make sure the response contains an array of asset types
      })
      .catch(error => {
        console.error('Error fetching asset types:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
   
    console.log({
      item_id: selectedItemId,
      asset_type_id: selectedAssetTypeId,
      asset_name: assetName,
      date: date,
      existing_amount: existingAmount,
      damaged_amount: damagedAmount,
      lost_amount: lostAmount,
      status: status,
    });
  
    // Conditional payload construction
    const payload = {};
  
    // Only add item_id if selected
    if (selectedItemId) {
      payload.item_id = selectedItemId;
    }
  
    // Only add asset_type_id if selected
    if (selectedAssetTypeId) {
      payload.asset_type_id = selectedAssetTypeId;
    }
  
    // Add other fields
    payload.asset_name = assetName;
    payload.date = date;
    payload.existing_amount = existingAmount;
    payload.damaged_amount = damagedAmount;
    payload.lost_amount = lostAmount;
    payload.status = status;
  
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}asset-audits`, payload);
      if (response.data.success) {
        // setSuccessMessage('Asset audit added successfully!');
        setModalOpen(true);
        setMessageType('success');
        setMessage('Asset audit added successfully!');
        // Reset form after successful submission
        setSelectedItemId('');
        setSelectedAssetTypeId('');
        setAssetName('');
        setDate('');
        setExistingAmount('');
        setDamagedAmount('');
        setLostAmount('');
        setStatus('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error adding asset audit.');
      setModalOpen(true);
      setMessageType('error');
      setMessage('Error adding asset audit.');
    }finally{
      setLoading(false);
    }
  };
  
  // Handles checkbox for Asset
  const handleAssetCheckbox = (e) => {
    setIsAssetSelected(e.target.checked);
  };

  // Handles checkbox for Item
  const handleItemCheckbox = (e) => {
    setIsItemSelected(e.target.checked);
  };

  return (
    <>
    <TitleCard title="Add Asset Audit" topMargin={"mt-1"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Checkbox for asset and item */}
        <div className="flex space-x-6 justify-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isAssetSelected}
              onChange={handleAssetCheckbox}
              id="assetCheckbox"
              className="mr-2"
            />
            <label htmlFor="assetCheckbox" className="text-lg">Select Asset</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isItemSelected}
              onChange={handleItemCheckbox}
              id="itemCheckbox"
              className="mr-2"
            />
            <label htmlFor="itemCheckbox" className="text-lg">Select Item</label>
          </div>
        </div>

        {/* Asset Type and Item Selection */}
        <div>
          {/* Asset Type Dropdown (enabled when Asset is selected) */}
          <div>
            <label htmlFor="asset_type_id" className="block text-sm font-medium text-white-700">Asset Type</label>
            <select
              id="asset_type_id"
              name="asset_type_id"
              value={selectedAssetTypeId}
              onChange={(e) => setSelectedAssetTypeId(e.target.value)}
              className="mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              required
              disabled={isItemSelected}  // Disable Asset Type when Item is selected
            >
              <option value="">Select Asset Type</option>
              {assetTypes.map((asset) => (
                <option key={asset.id} value={asset.id}>{asset.name}</option>
              ))}
            </select>
          </div>

          {/* Item Dropdown (enabled when Item is selected) */}
          <div>
            <label htmlFor="item_id" className="block text-sm font-medium text-white-700">Item</label>
            <select
              id="item_id"
              name="item_id"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              required
              disabled={isAssetSelected}  // Disable Item when Asset is selected
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>{item.itemName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Other Form Fields */}
        <div>
          <label htmlFor="asset_name" className="block text-sm font-medium text-white-700">Asset Name</label>
          <input
            type="text"
            id="asset_name"
            name="asset_name"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            className="mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            disabled={isItemSelected && !isAssetSelected}
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-white-700">Audited Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="existing_amount" className="block text-sm font-medium text-white-700">Existing Amount</label>
          <input
            type="number"
            id="existing_amount"
            name="existing_amount"
            value={existingAmount}
            onChange={(e) => setExistingAmount(e.target.value)}
            className="mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="1"
          />
        </div>

        <div>
          <label htmlFor="damaged_amount" className="block text-sm font-medium text-white-700">Damaged Amount</label>
          <input
            type="number"
            id="damaged_amount"
            name="damaged_amount"
            value={damagedAmount}
            onChange={(e) => setDamagedAmount(e.target.value)}
            className="mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="1"
          />
        </div>

        <div>
          <label htmlFor="lost_amount" className="block text-sm font-medium text-white-700">Lost Amount</label>
          <input
            type="number"
            id="lost_amount"
            name="lost_amount"
            value={lostAmount}
            onChange={(e) => setLostAmount(e.target.value)}
            className="mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="1"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-white-700">Status</label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">select status</option>
            <option value="to_be_checked">To Be Checked</option>
            <option value="confirmed">Confirmed</option>
            <option value="fail">Fail</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 mt-4 w-full bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disable={loading}
         >
            {loading ? 'Submitting...':'Add Asset Audit'}
          </button>
        </div>
      </form>
      </TitleCard>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </>
  );
};

export default AddAssetAuditPage;
