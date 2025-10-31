import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';
import SmartDateInput from "../../components/Common/smartDatePicker";

const AddAssetAuditPage = () => {
  const [items, setItems] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedAssetTypeId, setSelectedAssetTypeId] = useState('');
  const [date, setDate] = useState('');
  const [existingAmount, setExistingAmount] = useState('');
  const [damagedAmount, setDamagedAmount] = useState('');
  const [lostAmount, setLostAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isAssetSelected, setIsAssetSelected] = useState(false);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');





 

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}items`)
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));

    axios.get(`${process.env.REACT_APP_BASE_URL}asset`)
      .then(response => setAssetTypes(response.data.data))
      .catch(error => console.error('Error fetching asset types:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAssetSelected && !isItemSelected) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Please select either Asset or Item');
      return;
    }

     console.log("Submitting date:", date);

    const payload = {};
    if (selectedItemId) payload.item_id = selectedItemId;
    if (selectedAssetTypeId) payload.asset_type_id = selectedAssetTypeId;

    payload.date = date;
    payload.existing_amount = existingAmount;
    payload.damaged_amount = damagedAmount;
    payload.lost_amount = lostAmount;
    payload.status = status;

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}asset-audits`, payload);
      if (response.data.success) {
        setModalOpen(true);
        setMessageType('success');
        setMessage('Asset audit added successfully!');
        setSelectedItemId('');
        setSelectedAssetTypeId('');
        setDate('');
        setExistingAmount('');
        setDamagedAmount('');
        setLostAmount('');
        setStatus('');
        window.location.href = '/app/view-asset-audit'; 
      }
    } catch (error) {
      console.error('Error:', error);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Error adding asset audit.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssetCheckbox = (e) => {
    const checked = e.target.checked;
    setIsAssetSelected(checked);
    if (checked) {
      setIsItemSelected(false);
      setSelectedItemId('');
    }
  };

  const handleItemCheckbox = (e) => {
    const checked = e.target.checked;
    setIsItemSelected(checked);
    if (checked) {
      setIsAssetSelected(false);
      setSelectedAssetTypeId('');
  
    }
  };

  return (
    <>
      <TitleCard title="Add Asset Audit" topMargin={"mt-1"}>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {isAssetSelected && (
            <>
              <div>
                <label htmlFor="asset_type_id" className="block text-sm font-medium text-white-700">Asset Type</label>
                <select
                  id="asset_type_id"
                  value={selectedAssetTypeId}
                  onChange={(e) => setSelectedAssetTypeId(e.target.value)}
                  className="mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Asset Type</option>
                  {assetTypes.map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                  ))}
                </select>
              </div>
             {selectedAssetTypeId && (
              <p className="text-sm text-gray-400 mt-1">
                Available: {
                  assetTypes.find(asset => asset.id === Number(selectedAssetTypeId))?.amount ?? 0
                }
              </p>
            )}

            </>
          )}

          {isItemSelected && (
            <>
            <div>
              <label htmlFor="item_id" className="block text-sm font-medium text-white-700">Item</label>
              <select
                id="item_id"
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="mt-2 p-3 bg-base-100 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Item</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>{item.itemName}</option>
                ))}
              </select>
            </div>
            {selectedItemId && (
              <p className="text-sm text-gray-400 mt-1">
                Available:  {parseInt(items.find(item => item.id === Number(selectedItemId))?.itemAmount || 0)}
              </p>
            )}
            </>
          )}

   <div className="relative">
  <label htmlFor="date" className="block text-sm font-medium text-white-700">
    Audited Date
  </label>

  <SmartDateInput
    id="date"
    value={date}
    onChange={setDate}
    className="mt-1 w-full bg-base-100 border border-gray-300 rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-blue-500"
    required
  />
</div>



          <div>
            <label htmlFor="existing_amount" className="block text-sm font-medium text-white-700">Existing Amount</label>
            <input
              type="number"
              id="existing_amount"
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
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Add Asset Audit'}
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
