import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import Modal from '../../components/Modal';
import DisplayDate from '../../components/Common/displayDate';
import SmartDateInput from '../../components/Common/smartDatePicker';

const AssetAuditPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false); // New state for detail modal
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [formData, setFormData] = useState({});
  const [assetTypes, setAssetTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [isItemAudit, setIsItemAudit] = useState(false);
  const [isAssetAudit, setIsAssetAudit] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [allAuditData, setAllAuditData] = useState([]);

  

  const fetchData = async () => {
  try {
    const auditsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}asset-audits`);
    if (auditsResponse.data.success) {
      const allAudits = auditsResponse.data.data;

      // Group audits by item_id or asset_type_id
      const grouped = {};
      allAudits.forEach(audit => {
        const key = audit.item_id || `asset-${audit.asset_type_id}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(audit);
      });

      // Get the latest audit in each group
      const latestAudits = Object.values(grouped).map(group =>
        group.reduce((latest, current) =>
          new Date(current.date) > new Date(latest.date) ? current : latest
        )
      );

      setData(latestAudits);      // Show only latest in table
      setAllAuditData(allAudits); // Store all for hover history
    }

    const assetTypesResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}asset`);
    if (assetTypesResponse.data.success) {
      setAssetTypes(assetTypesResponse.data.data);
    }

    const itemsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}items`);
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
    const hasItemId = row.item_id || row.Item?.id;
    const hasAssetTypeId = row.asset_type_id || row.AssetType?.id;
    setIsItemAudit(hasItemId && !hasAssetTypeId);
    setIsAssetAudit(hasAssetTypeId && !hasItemId);

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

  const handleDetail = (row) => {
    setSelectedAudit(row);
    setDetailModalOpen(true); // Open detail modal
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
    label: 'Name',
    key: 'name',
    render: (row) => {
      const key = row.item_id || `asset-${row.asset_type_id}`;
      const fullHistory = allAuditData
        .filter(a => (a.item_id || `asset-${a.asset_type_id}`) === key)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      return (
        <div className="relative group cursor-pointer">
          {row.Item ? row.Item.itemName : row.AssetType?.name || 'N/A'}

          <div className="absolute z-10 hidden group-hover:block bg-white border border-gray-300 shadow-md rounded p-2 text-sm top-full left-0 w-60">
            <div className="font-semibold text-gray-700 mb-1">Audit History</div>
            {fullHistory.map((h, i) => (
              <div key={i} className="flex justify-between border-b border-gray-200 py-1 text-xs">
                <span>{h.status}</span>
                <span>{new Date(h.date).toISOString().split('T')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      );
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
  { label: 'Existing Amount', key: 'existing_amount' },
  { label: 'Status', key: 'status' },
  {
    label: 'Audit Date',
    key: 'date',
    isDate: true
  },
  {
    label: 'Actions',
    key: 'actions',
    render: (row) => (
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => handleEdit(row)}
          className="bg-blue-500 text-white px-2 py-1 rounded-md"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(row)}
          className="bg-red-500 text-white px-1 py-1 rounded-md"
        >
          Delete
        </button>
        <button
          onClick={() => handleDetail(row)}
          className="bg-gray-400 text-white py-1 px-1 rounded"
        >
          Detail
        </button>
      </div>
    )
  }
];
  const handleAddClick = () => {
    window.location.href = '/app/add-asset-audit';
  };

  return (
    <>
      {loading ? (<LoadingComponent />) : (
        <TableComponent 
          title="Asset Audits" 
          data={data} 
          columns={columns} 
          showSearch={true}
          exportable={true}
          onAdd={handleAddClick}
          className="min-w-full table-compact" // Suggesting a compact class
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
                  disabled={isAssetAudit}
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
                <label className="block text-sm font-medium text-white-700 mb-1">Asset </label>
                <select
                  value={formData.asset_type_id}
                  onChange={(e) => setFormData({...formData, asset_type_id: e.target.value})}
                  className="w-full bg-base-100 p-2 border rounded"
                  disabled={isItemAudit}
                >
                  <option value="">Select Asset Type</option>
                  {assetTypes.map(assetType => (
                    <option key={assetType.id} value={assetType.id}>
                      {assetType.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  value={formData.asset_name}
                  onChange={(e) => setFormData({...formData, asset_name: e.target.value})}
                  className="w-full bg-base-100 p-2 border rounded"
                  disabled={isItemAudit}
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Date</label>
                <SmartDateInput
                  value={formData.date}
                  onChange={(gcDate) => setFormData({...formData, date: gcDate})}
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
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Damaged Amount</label>
                <input
                  type="number"
                  value={formData.damaged_amount}
                  onChange={(e) => setFormData({...formData, damaged_amount: parseInt(e.target.value)})}
                  className="w-full bg-base-100 p-2 border rounded"
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white-700 mb-1">Lost Amount</label>
                <input
                  type="number"
                  value={formData.lost_amount}
                  onChange={(e) => setFormData({...formData, lost_amount: parseInt(e.target.value)})}
                  className="w-full bg-base-100 p-2 border rounded"
                  min="0"
                  step="1"
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
                  <option value="fail">Fail</option>
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
                disabled={btnLoading}
              >
                {btnLoading ? 'Saving...' : 'Save'}
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

      {/* Detail Modal */}
      {detailModalOpen && selectedAudit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Asset Audit Details</h2>
            <div className="space-y-2">
              <p><strong>Item Name:</strong> {selectedAudit.Item ? selectedAudit.Item.itemName : 'N/A'}</p>
              <p><strong>Asset Type:</strong> {selectedAudit.AssetType ? selectedAudit.AssetType.name : 'N/A'}</p>
              <p><strong>Date:</strong> <DisplayDate date={selectedAudit.date}/></p>
              <p><strong>Existing Amount:</strong> {selectedAudit.existing_amount || 0}</p>
              <p><strong>Damaged Amount:</strong> {selectedAudit.damaged_amount || 0}</p>
              <p><strong>Lost Amount:</strong> {selectedAudit.lost_amount || 0}</p>
              <p><strong>Status:</strong> {selectedAudit.status || 'N/A'}</p>
              </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-300  rounded"
              >
                Close
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