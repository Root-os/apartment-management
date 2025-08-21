import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/table";
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';

const FloorManagement = () => {
  const [floors, setFloors] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floorDetails, setFloorDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');
  const [newFloorData, setNewFloorData] = useState({
    floorNumber: '',
    totalUnits: '',
    rentedUnits: '',
    freeUnits: ''
  });
  const [loading, setLoading] = useState(true);  
  const [buttonLoading, setButtonLoading] = useState(false);  

  const navigate = useNavigate();

  // Fetch floors
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}floor`)
      .then(response => {
        setFloors(response.data);
      })
      .catch(error => {
        console.error("Error fetching floors:", error);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  // Edit floor
  const handleEditClick = (floor) => {
    setSelectedFloor(floor);
    setNewFloorData({
      floorNumber: floor.floorNumber,
       status: floor.status || 'active', 
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    setButtonLoading(true); // Start button loading
    axios.put(`${process.env.REACT_APP_BASE_URL}floor/${selectedFloor.id}`, newFloorData)
      .then(() => {
        setFloors(floors.map(floor => (floor.id === selectedFloor.id ? { ...floor, ...newFloorData } : floor)));
        setIsEditModalOpen(false);

        setModalOpen(true);
        setMessageType('success');
        setMessage('Floor updated successfully');
      })
      .catch(error => {
        console.error("Error updating floor:", error);

        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to update, please try again');
      })
      .finally(() => {
        setButtonLoading(false); // End button loading
      });
  };

  // Delete floor
  const handleDeleteClick = (floor) => {
    setSelectedFloor(floor);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setButtonLoading(true); // Start button loading for delete
    axios.delete(`${process.env.REACT_APP_BASE_URL}floor/${selectedFloor.id}`)
      .then(() => {
        setFloors(floors.filter(floor => floor.id !== selectedFloor.id));
        setIsDeleteModalOpen(false);

        setModalOpen(true);
        setMessageType('success');
        setMessage('Floor deleted successfully');
      })
      .catch(error => {
        console.error("Error deleting floor:", error);

        setModalOpen(true);
        setMessageType('error');
        setMessage('Unable to delete, please try again');
      })
      .finally(() => {
        setButtonLoading(false); // End button loading for delete
      });
  };

  // Detail floor
const handleDetailClick = (floor) => {
  axios.get(`${process.env.REACT_APP_BASE_URL}floor/${floor.id}`)
    .then(response => {
      setFloorDetails({
        ...floor,             
        ...response.data      
      });
      setIsDetailModalOpen(true);
    })
    .catch(error => console.error("Error fetching floor details:", error));
};

  const columns = [
    { key: 'floorNumber', label: 'Floor Name' },
    { key: 'noUnits', label: 'Total Units' },
    { key: 'rentedUnits', label: 'Rented Units' },
    { key: 'freeUnits', label: 'Free Units' },
    {
      key: 'actions',
      label: 'Actions',
      render: (floor) => (
        <>
          <button
            onClick={() => handleEditClick(floor)}
            className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(floor)}
            className="bg-red-500 text-white py-1 px-4 rounded mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => handleDetailClick(floor)}
            className="bg-gray-400 text-white py-1 px-2 rounded"
          >
            Detail
          </button>
        </>
      )
    }
  ];

  const handleAddClick = () => {
   window.location.href = '/app/add-floor';
  };

  return (
    <div>
      {loading ? (<LoadingComponent/>):(

      <TableComponent
        title="Floor List"
        data={floors}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
        onAdd={handleAddClick}
      />
    )}
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Edit Floor</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Floor Name</label>
              <input
                type="text"
                value={newFloorData.floorNumber}
                onChange={(e) => setNewFloorData({ ...newFloorData, floorNumber: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
             <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Number of Units Name</label>
              <input
                type="number"
                value={newFloorData.noUnits}
                onChange={(e) => setNewFloorData({ ...newFloorData, noUnits: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={newFloorData.status}
                onChange={(e) => setNewFloorData({ ...newFloorData, status: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                <option value="active">Active</option>
                <option value="inActive">In Active</option>
                <option value="under_construction">Under Construction</option>
              </select>
            </div>


            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button 
                onClick={handleEditSubmit} 
                className="bg-blue-500 text-white px-4 py-2 rounded" 
                disabled={buttonLoading}
              >
                {buttonLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div  className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Are you sure you want to delete this floor?</h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={buttonLoading}
              >
                {buttonLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && floorDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-base-100 p-6 rounded-lg max-w-4xl max-h-[80vh] overflow-y-scroll">
            {/* Floor Summary */}
            <h2 className="text-xl mb-2">Floor Detail</h2>
            <p className="text-sm  mb-4">
              <strong>Name:</strong> {floorDetails.floorNumber} &nbsp;|&nbsp;
              <strong>Status:</strong>{" "}
              <span className={`font-semibold ${
                floorDetails.status === 'active'
                  ? 'text-green-600'
                  : floorDetails.status === 'inActive'
                  ? 'text-red-600'
                  : floorDetails.status === 'under_construction'
                  ? 'text-yellow-600'
                  : 'text-gray-600'
              }`}>
                {floorDetails.status || "Not specified"}
              </span> &nbsp;|&nbsp;
              <strong>Total Slots:</strong> {floorDetails.noUnits} &nbsp;|&nbsp;
              <strong>Created:</strong> {floorDetails.totalUnits} &nbsp;|&nbsp;
              <strong>Rented:</strong> {floorDetails.rentedUnits} &nbsp;|&nbsp;
              <strong>Free:</strong> {
                Array.isArray(floorDetails.freeUnits)
                  ? floorDetails.freeUnits.length
                  : floorDetails.freeUnits || 0
              }
            </p>

            {/* Free Unit Details */}
            <h2 className="text-xl mb-4">Free Units of the Floor</h2>
            {Array.isArray(floorDetails.freeUnits) && floorDetails.freeUnits.length > 0 ? (
              <ul className="space-y-3">
                {floorDetails.freeUnits.map(unit => (
                  <li key={unit.id} className="bg-base-100 p-3 rounded">
                    <strong className="text-blue-700">Unit Number:</strong> {unit.unitNumber}<br />
                    <strong>Size:</strong> {unit.size} sq ft<br />
                    <strong>Status:</strong> {unit.status}<br />
                    <strong>Available Equipments:</strong>
                    <ul className="list-disc ml-5">
                      {Array.isArray(unit.availableEquipments)
                        ? unit.availableEquipments.map((eq, i) => <li key={i}>{eq}</li>)
                        : JSON.parse(unit.availableEquipments || '[]').map((eq, i) => <li key={i}>{eq}</li>)
                      }
                    </ul>
                    <strong>Problems:</strong>
                    <ul className="list-disc ml-5">
                      {Array.isArray(unit.problems)
                        ? unit.problems.map((p, i) => <li key={i}>{p}</li>)
                        : JSON.parse(unit.problems || '[]').map((p, i) => <li key={i}>{p}</li>)
                      }
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-center">
                <p>No free units available for this floor.</p>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end mt-4">
              <button onClick={() => setIsDetailModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
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
    </div>
  );
};

export default FloorManagement;
