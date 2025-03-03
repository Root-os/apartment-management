import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import DeleteConfirmationModal from '../../components/editDeleteModal';
import Modal from '../../components/Modal'

const MaintenancePage = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteItemData, setDeleteItemData] = useState(null); 
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    cost: '',
    itemId: '',
    unitId: ''
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  // Fetch data on page load
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}maintenance`);
        setMaintenanceData(response.data);
        setLoading(false);
      } catch (err) {
        setModalOpen(true);
        setMessageType('error');
        setMessage('Failed to fetch maintenance data')
        setLoading(false);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}items`);
        setItems(response.data);
      } catch (err) {
        setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to get items')
      }
    };

    const fetchUnits = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}unit`);
        setUnits(response.data);
      } catch (err) {
        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to get units')
      }
    };

    fetchMaintenanceData();
    fetchItems();
    fetchUnits();
  }, []);

  const getItemName = (itemId) => {
    const item = items.find((item) => item.id === itemId);
    return item ? item.itemName : 'N/A'; 
  };

  const getUnitNumber = (unitId) => {
    const unit = units.find((unit) => unit.id === unitId);
    return unit ? unit.unitNumber : 'N/A'; 
  };

  const handleDeleteButtonClick = (record) => {
    setDeleteItemData(record); 
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}maintenance/${id}`);
      setMaintenanceData(maintenanceData.filter(item => item.id !== id)); // Remove deleted item from state
      setIsDeleteModalOpen(false);

      setModalOpen(true);
      setMessageType('success');
      setMessage('Maintenance data deleted successfully!')
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to delete Maintenance data')
    }
  };

  // Function to handle edit modal opening
  const openEditModal = (record) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      description: record.description,
      cost: record.cost,
      itemId: record.itemId,
      unitId: record.unitId
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setFormData({
      date: '',
      description: '',
      cost: '',
      itemId: '',
      unitId: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}maintenance/${editingRecord.id}`,
        {
          date: formData.date,
          description: formData.description,
          cost: parseFloat(formData.cost),
          itemId: parseInt(formData.itemId),
          unitId: parseInt(formData.unitId)
        }
      );
      const updatedData = maintenanceData.map((item) =>
        item.id === editingRecord.id ? response.data : item
      );
      setMaintenanceData(updatedData);
      closeModal();

      setModalOpen(true);
      setMessageType('success');
      setMessage('Maintenance data updated successfully!')
    } catch (err) {
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to edit Maintenance data')
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
        label: 'Item',
        key: 'itemName',
        render: (row) => getItemName(row.itemId), // Display item name
      },
      {
        label: 'Unit',
        key: 'unitNumber',
        render: (row) => getUnitNumber(row.unitId), // Display unit number
      },
      { label: 'Description', key: 'description' },
      { label: 'Cost', key: 'cost' },
      { 
          label: 'Date', 
          key: 'date', 
          render: (row) => {
            if (row.date) {
              const date = new Date(row.date);
              return date.toLocaleDateString('en-US'); 
            }
            return 'N/A'; 
          }
        },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div>
          <button
            onClick={() => openEditModal(row)}
             className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteButtonClick(row)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <TableComponent
        title="Maintenance Records"
        data={maintenanceData}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
      />

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-xl font-semibold">Edit Maintenance Record</h3>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cost" className="block text-sm">Cost</label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="itemId" className="block text-sm">Item</label>
                <select
                  id="itemId"
                  name="itemId"
                  value={formData.itemId}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  required
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.itemName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="unitId" className="block text-sm">Unit</label>
                <select
                  id="unitId"
                  name="unitId"
                  value={formData.unitId}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  required
                >
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unitNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={closeModal}>Cancel</button>
                <button type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        data={deleteItemData}
      />
      <Modal
       isOpen={modalOpen}
       onClose={()=> setModalOpen(false)}
       messageType={messageType}
       message={message}
      />
    </>
  );
};

export default MaintenancePage;
