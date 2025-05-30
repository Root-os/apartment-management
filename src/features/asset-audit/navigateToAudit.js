import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import LoadingComponent from '../../components/loading';
import Modal from '../../components/Modal';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigateAssetAudit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [allAuditData, setAllAuditData] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const auditsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}asset-audits`);
      if (auditsResponse.data.success) {
        const allAudits = auditsResponse.data.data;

        const itemMatch = allAudits.filter(a => a.item_id?.toString() === id?.toString());
        const assetMatch = allAudits.filter(a => a.asset_type_id?.toString() === id?.toString());
        const filteredAudits = itemMatch.length > 0 ? itemMatch : assetMatch;

        setData(filteredAudits);
        setAllAuditData(filteredAudits);
      }

      const [assetTypesResponse, itemsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BASE_URL}asset`),
        axios.get(`${process.env.REACT_APP_BASE_URL}items`)
      ]);

      if (assetTypesResponse.data.success) {
        setAssetTypes(assetTypesResponse.data.data);
      }

      setItems(itemsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setModalOpen(true);
      setMessageType('error');
      setMessage('Failed to fetch audit history');
    } finally {
      setLoading(false);
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
      render: (row) =>
        row.date ? new Date(row.date).toISOString().split('T')[0] : 'N/A',
    },
  ];

  const title = data.length > 0 && data[0].item_id ? "Item Audit History" : "Asset Audit History";

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      {loading ? (
        <LoadingComponent />
      ) : data.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No audit history for this item or asset
        </div>
      ) : (
        <TableComponent
          title={title}
          data={data}
          columns={columns}
          showSearch={true}
          exportable={true}
          className="min-w-full table-compact"
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default NavigateAssetAudit;