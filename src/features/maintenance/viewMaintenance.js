import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../components/table';
import DeleteConfirmationModal from '../../components/editDeleteModal';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';
import SmartDateInput from '../../components/Common/smartDatePicker';

const MaintenancePage = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
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
      }finally {
        setPageLoading(false);
      };
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

  // Check if itemId exists, if so set isItem to true, otherwise false
  const isItem = record.itemId != null;

  setFormData({
    date: record.date,
    description: record.description,
    cost: record.cost,
    itemId: record.itemId,
    unitId: record.unitId,
    isItem: isItem, // Set the initial state of isItem based on the record
    name: isItem ? '' : record.name // If it's an item, name is not used
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

  const handleDateChange = (fieldName) => (dateValue) => {
  setFormData((prevState) => ({
    ...prevState,
    [fieldName]: dateValue
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Dynamically build the payload based on whether isItem is true or false
    const payload = {
    date: formData.date,
    description: formData.description,
    cost: parseFloat(formData.cost),
    isItem: formData.isItem,
    ...(formData.isItem && { itemId: parseInt(formData.itemId) }),
    ...(formData.isItem === false && { 
      name: formData.name,
      unitId: parseInt(formData.unitId) 
    })
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}maintenance/${editingRecord.id}`,
        payload
      );
      const updatedData = maintenanceData.map((item) =>
        item.id === editingRecord.id ? response.data : item
      );
      setMaintenanceData(updatedData);
      closeModal();
      setIsModalOpen(false)
  
      setModalOpen(true);
      setMessageType('success');
      setMessage('Maintenance data updated successfully!');
    } catch (err) {
      closeModal();
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to edit Maintenance data');
    } finally {
      setLoading(false);
    }
  };
  

  const columns = [
    {
      label: 'Name',
      key: 'name',
      render: (row) => {
        return row.isItem
          ? getItemName(row.itemId)
          : row.name || 'N/A';
      },
      style: { width: '200px' },
    },
    {
      label: 'Room',
      key: 'unitOrStore',
      render: (row) => {
        return row.isItem ? 'Store' : getUnitNumber(row.unitId);
      },
      style: { width: '150px' },
    },
    {
      label: 'Description',
      key: 'description',
      style: { width: '200px' },  // Minimized column size for 'Description'
    },
    {
      label: 'Cost',
      key: 'cost',
      style: { width: '100px' },  
    },
    {
      label: 'Maintenance Date',
      key: 'date',
      isDate: true,
      style: { width: '150px' },  
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => openEditModal(row)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteButtonClick(row)}
            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
          >
            Delete
          </button>
          {/* <button
            onClick={() => (row)}
            className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm"
          >
            Details
          </button> */}
        </div>
      ),
    },
  ];
  

  const handleAddClick = () => {
    window.location.href = '/app/add-maintenance';
   };

  return (
    <>
      {pageLoading ? (<LoadingComponent/>):(
      <TableComponent
        title="Maintenance Records"
        data={maintenanceData}
        columns={columns}
       rowsPerPageOptions={[5, 10, 15]}

        showSearch={true}
        exportable={true}
        onAdd={handleAddClick}
      />
    )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-xl font-semibold">Edit Maintenance Record</h3>
            <form onSubmit={handleSubmit} className="mt-4">
              {formData.isItem ? (
                <div className="mb-4">
                  <label htmlFor="itemId" className="block text-sm">Item</label>
                  <select
                    id="itemId"
                    name="itemId"
                    value={formData.itemId}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.itemName}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm">Date</label>
                <SmartDateInput
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleDateChange('date')}
                  className="input input-bordered w-full"
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
                  min="0"
                  step="1"
                />
              </div>
              {!formData.isItem && (
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
              )}
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
