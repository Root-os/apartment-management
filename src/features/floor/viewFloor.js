import React, { useState, useEffect } from "react";
import axios from "axios";
<<<<<<< HEAD
=======
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/table";
>>>>>>> origin/rodas

const FloorManagement = () => {
  const [floors, setFloors] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
<<<<<<< HEAD
  const [newFloorData, setNewFloorData] = useState({});

  // Fetch floors
  useEffect(() => {
    axios.get("https://apartment.houseethiopia.com/api/floor")
      .then(response => {
        setFloors(response.data);
        console.log(response.data);
=======
  const [newFloorData, setNewFloorData] = useState({
    name: '',
    totalUnits: '',
    rentedUnits: '',
    freeUnits: ''
  });

  const navigate = useNavigate();

  // Fetch floors
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}floor`)
      .then(response => {
        setFloors(response.data);
>>>>>>> origin/rodas
      })
      .catch(error => {
        console.error("Error fetching floors:", error);
      });
  }, []);

  // Edit floor
  const handleEditClick = (floor) => {
    setSelectedFloor(floor);
    setNewFloorData({
      name: floor.name,
      totalUnits: floor.totalUnits,
      rentedUnits: floor.rentedUnits,
      freeUnits: floor.freeUnits,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
<<<<<<< HEAD
    axios.put(`https://apartment.houseethiopia.com/api/floor/${selectedFloor.id}`, newFloorData)
=======
    axios.put(`${process.env.REACT_APP_BASE_URL}floor/${selectedFloor.id}`, newFloorData)
>>>>>>> origin/rodas
      .then(() => {
        setFloors(floors.map(floor => (floor.id === selectedFloor.id ? { ...floor, ...newFloorData } : floor)));
        setIsEditModalOpen(false);
      })
      .catch(error => {
        console.error("Error updating floor:", error);
      });
  };

  // Delete floor
  const handleDeleteClick = (floor) => {
    setSelectedFloor(floor);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
<<<<<<< HEAD
    axios.delete(`https://apartment.houseethiopia.com/api/floor/${selectedFloor.id}`)
=======
    axios.delete(`${process.env.REACT_APP_BASE_URL}floor/${selectedFloor.id}`)
>>>>>>> origin/rodas
      .then(() => {
        setFloors(floors.filter(floor => floor.id !== selectedFloor.id));
        setIsDeleteModalOpen(false);
      })
      .catch(error => {
        console.error("Error deleting floor:", error);
      });
  };

<<<<<<< HEAD
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Floor Management</h1>
      <div className="overflow-x-auto bg-base-100 rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-base-300 text-left">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Total Units</th>
              <th className="px-6 py-3">Rented Units</th>
              <th className="px-6 py-3">Free Units</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {floors.map(floor => (
              <tr key={floor.id}>
                <td className="px-6 py-3">{floor.name}</td>
                <td className="px-6 py-3">{floor.totalUnits}</td>
                <td className="px-6 py-3">{floor.rentedUnits}</td>
                <td className="px-6 py-3">{floor.freeUnits}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleEditClick(floor)}
                    className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(floor)}
                    className="bg-red-500 text-white py-1 px-4 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
=======
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'totalUnits', label: 'Total Units' },
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
            onClick={() => handleDeleteClick(floor)}
            className="bg-grey-500 text-white py-1 px-4 rounded"
          >
            Detail
          </button>
        </>
      )
    }
  ];

  const handleAddClick = () => {
    navigate('/floor-add');
  };

  return (
    <div className="p-8">
      <TableComponent
        title="Floor List"
        data={floors}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
        onAdd={handleAddClick}
      />
>>>>>>> origin/rodas

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Edit Floor</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Floor Name</label>
              <input
                type="text"
                value={newFloorData.name}
                onChange={(e) => setNewFloorData({ ...newFloorData, name: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Total Units</label>
              <input
                type="number"
                value={newFloorData.totalUnits}
                onChange={(e) => setNewFloorData({ ...newFloorData, totalUnits: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
<<<<<<< HEAD
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rented Units</label>
              <input
                type="number"
                value={newFloorData.rentedUnits}
                onChange={(e) => setNewFloorData({ ...newFloorData, rentedUnits: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Free Units</label>
              <input
                type="number"
                value={newFloorData.freeUnits}
                onChange={(e) => setNewFloorData({ ...newFloorData, freeUnits: e.target.value })}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
=======
>>>>>>> origin/rodas
            <div className="flex justify-between">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleEditSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Are you sure you want to delete this floor?</h2>
            <div className="flex justify-between">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDeleteConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
<<<<<<< HEAD
=======
              
>>>>>>> origin/rodas
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default FloorManagement;
=======
export default FloorManagement;
>>>>>>> origin/rodas
