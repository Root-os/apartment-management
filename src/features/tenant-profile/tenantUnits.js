import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/table";
import LoadingComponent from "../../components/loading";
import api from "../../utils/api";

const TenantUnits = () => {
  const [unitsData, setUnitsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Decode JWT to get phone number
    const payload = JSON.parse(atob(token.split(".")[1]));
    const phoneNumber = payload.phone;

    api
      .get(`tenant/floor-units?phoneNumber=${phoneNumber}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setUnitsData(res.data[0].tenant); // tenant array
        } else {
          setUnitsData([]);
        }
      })
      .catch((err) => console.error("Error fetching tenant units:", err))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "unitNumber", label: "Unit Number", render: (row) => row.unit?.unitNumber || "-" },
    { key: "floorNumber", label: "Floor", render: ((row) => row.floor?.floorNumber || "-") },
    { key: "amount", label: "Rent Amount" },
    // {
    //   key: "leaseStartDate",
    //   label: "Lease Start",
    //   render: (row) => new Date(row.leaseStartDate).toLocaleDateString(),
    // },
    // {
    //   key: "leaseEndDate",
    //   label: "Lease End",
    //   render: (row) => new Date(row.leaseEndDate).toLocaleDateString(),
    // },
    // { key: "unit.status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={() => {
            setSelectedUnit(row);
            setModalOpen(true);
          }}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Details
        </button>
      ),
    },
  ];

  return (
    <div className="p-4">
      {loading ? (
        <LoadingComponent />
      ) : (
        <TableComponent
          title="My Units"
          data={unitsData}
          columns={columns}
          showSearch={true}
          exportable={true}
        />
      )}

      {/* Detail Modal */}
      {modalOpen && selectedUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-base-100 p-6 rounded-lg max-w-lg w-full overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl mb-4">Unit Details</h2>
            <p><strong>Tenant Name:</strong> {selectedUnit.fullName}</p>
            <p><strong>Phone Number:</strong> {selectedUnit.phoneNumber}</p>
            <p><strong>Unit Number:</strong> {selectedUnit.unit.unitNumber}</p>
            <p><strong>Floor:</strong> {selectedUnit.floor.floorNumber}</p>
            <p><strong>Status:</strong> {selectedUnit.unit.status}</p>
            <p><strong>Lease Start:</strong> {new Date(selectedUnit.leaseStartDate).toLocaleDateString()}</p>
            <p><strong>Lease End:</strong> {new Date(selectedUnit.leaseEndDate).toLocaleDateString()}</p>
            <p><strong>Size (m²):</strong> {selectedUnit.unit.size} sq ft</p>
            <p><strong>Rent Amount:</strong> {selectedUnit.amount}</p>
            {(() => {
        const equipments = selectedUnit.unit.availableEquipment
          ? JSON.parse(selectedUnit.unit.availableEquipment)
          : [];
        const problems = selectedUnit.unit.problem
          ? JSON.parse(selectedUnit.unit.problem)
          : [];

        return (
          <>
            <div className="mt-3">
              <strong>Available Equipments:</strong>
              {equipments.length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {equipments.map((eq, i) => <li key={i}>{eq}</li>)}
                </ul>
              ) : (
                <p className="text-gray-500 ml-4">No equipment listed</p>
              )}
            </div>

            <div className="mt-3">
              <strong>Problems:</strong>
              {problems.length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {problems.map((prob, i) => <li key={i}>{prob}</li>)}
                </ul>
              ) : (
                <p className="text-gray-500 ml-4">No problems reported</p>
              )}
            </div>
          </>
        );
      })()}
           

            {/* Vehicles */}
            <div className="mt-4">
              <h3 className="text-lg mb-2">Vehicles</h3>
              {selectedUnit.vehicles && selectedUnit.vehicles.length > 0 ? (
                <ul className="list-disc ml-5">
                  {selectedUnit.vehicles.map((vehicle, index) => (
                    <li key={index}>
                      {vehicle.make} {vehicle.model} - {vehicle.plateNumber}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No vehicles registered.</p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantUnits;
