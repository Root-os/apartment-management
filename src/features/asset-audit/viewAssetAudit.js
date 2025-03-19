import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import Modal from '../../components/Modal';

const AssetAuditPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [formData, setFormData] = useState({});
  const [assetTypes, setAssetTypes] = useState([]);
  const [items, setItems] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch all initial data
  const fetchData = async () => {
    try {
      
      const auditsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}asset-audits`);
      if (auditsResponse.data.success) {
        setData(auditsResponse.data.data);
      }

      const assetTypesResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}asset`);
      if (assetTypesResponse.data.success) {
        setAssetTypes(assetTypesResponse.data.data);
      }

      const itemsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}items`);
      console.log("Items Response:", itemsResponse.data);
      // Since the response is a plain array, set it directly
      setItems(itemsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row) => {
    setSelectedAudit(row);
    setFormData({
      item_id: row.item_id || row.Item?.id || '',
      asset_type_id: row.asset_type_id || row.AssetType?.id || '',
      asset_name: row.asset_name || '',
      date: row.date || '',
      existing_amount: row.existing_amount || 0,
      damaged_amount: row.damaged_amount || 0,
      lost_amount: row.lost_amount || 0,
      status: row.status || ''
    });
    setEditModalOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedAudit(row);
    setDeleteModalOpen(true);
  };

  const submitEdit = async () => {
  setBtnLoading(true);
  try {
    const requestData = {
      ...formData,
      item_id: formData.item_id || undefined,
      asset_type_id: formData.asset_type_id || undefined,
    };

    console.log("Request Data:", requestData);  

    const response = await axios.put(
      `${process.env.REACT_APP_BASE_URL}asset-audits/${selectedAudit.id}`,
      requestData
    );

    if (response.data.success) {
      const updatedAudit = {
        ...response.data.data,
        Item: items.find(item => item.id === Number(formData.item_id)),
        AssetType: assetTypes.find(type => type.id === Number(formData.asset_type_id))
      };

      setData(prevData => prevData.map(item => 
        item.id === selectedAudit.id ? updatedAudit : item
      ));
      setEditModalOpen(false);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Asset audit updated successfully');
    }
  } catch (error) {
    console.error("Error updating audit:", error);
    setModalOpen(true);
    setMessageType('error');
    setMessage('Unable to update asset audit.');
  } finally {
    setBtnLoading(false);
  }
};

  

  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}asset-audits/${selectedAudit.id}`);
      setData(prevData => prevData.filter(item => item.id !== selectedAudit.id));
      setDeleteModalOpen(false);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Asset audit deleted successfully');
    } catch (error) {
      console.error("Error deleting audit:", error);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete the data.');
    }
  };

  const columns = [
    {
      label: 'Item Name',
      key: 'Item.itemName',
      render: (row) => row.Item ? row.Item.itemName : 'N/A',
    },
    {
      label: 'Asset Type',
      key: 'AssetType.name',
      render: (row) => row.AssetType ? row.AssetType.name : 'N/A',
    },
    { label: 'Asset Name', key: 'asset_name' },
    { label: 'Existing Amount', key: 'existing_amount' },
    { label: 'Damaged Amount', key: 'damaged_amount' },
    { label: 'Lost Amount', key: 'lost_amount' },
    { label: 'Status', key: 'status' },
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
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(row)}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
          <button 
            onClick={() => handleDelete(row)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      )
    }
  ];
  const handleAddClick = () => {
    window.location.href='/app/add-asset-audit'
  }

  return (
    <>
      {loading ? (<LoadingComponent/>):(
      <TableComponent 
        title="Asset Audits" 
        data={data} 
        columns={columns} 
        showSearch={true}
        exportable={true}
        onAdd={handleAddClick}
      />
    )}
      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96 max-h-[80vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4">Edit Asset Audit</h2>
            <div className="space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Item</label>
                <select
                  value={formData.item_id}
                  onChange={(e) => setFormData({...formData, item_id: e.target.value})}
                  className="w-full bg-base-100 p-2 border rounded"
                >
                  <option value="">Select Item</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.itemName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Asset Type</label>
                <select
                  value={formData.asset_type_id}
                  onChange={(e) => setFormData({...formData, asset_type_id: e.target.value})}
                  className="w-full bg-base-100 p-2 border rounded"
                >
                  <option value="">Select Asset Type</option>
                  {assetTypes.map(assetType => (
                    <option key={assetType.id} value={assetType.id}>
                      {assetType.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  value={formData.asset_name}
                  onChange={(e) => setFormData({...formData, asset_name: e.target.value})}
                  className="w-full bg-base-100 p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-base-100 p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Existing Amount</label>
                <input
                  type="number"
                  value={formData.existing_amount}
                  onChange={(e) => setFormData({...formData, existing_amount: parseInt(e.target.value)})}
                  className="w-full bg-base-100 p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Damaged Amount</label>
                <input
                  type="number"
                  value={formData.damaged_amount}
                  onChange={(e) => setFormData({...formData, damaged_amount: parseInt(e.target.value)})}
                  className="w-full bg-base-100 p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Lost Amount</label>
                <input
                  type="number"
                  value={formData.lost_amount}
                  onChange={(e) => setFormData({...formData, lost_amount: parseInt(e.target.value)})}
                  className="w-full bg-base-100 p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-base-100 p-2 border rounded"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="to_be_checked">To be checked</option>
                  <option value="fail">fail</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disable={btnLoading}
              >
                {btnLoading ? 'Saving...':'Save'}
                
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this asset audit?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            messageType={messageType}
            message={message}
          />
    </>
  );
};

export default AssetAuditPage;