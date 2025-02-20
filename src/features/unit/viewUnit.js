import React, { useState, useEffect } from "react";
import axios from "axios";

const UnitList = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        const response = await axios.get(`https://apartment.houseethiopia.com/api/unit`);
        setUnits(response.data); 
        setLoading(false); 
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false); 
      }
    };

    fetchUnitData();
  }, []);
  const columns = [
    {
      Header: "Unit Number",
      accessor: "unitNumber",
    },
    {
      Header: "Size (sq.m)",
      accessor: "size",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Available Equipments",
      accessor: "availableEquipments",
      Cell: ({ value }) => {
        // Display equipment items as a list
        const equipments = JSON.parse(value);
        return <ul>{equipments.map((item, index) => <li key={index}>{item}</li>)}</ul>;
      },
    },
    {
      Header: "Problems",
      accessor: "problems",
      Cell: ({ value }) => {
        // Display problems as a list
        const problems = JSON.parse(value);
        return <ul>{problems.map((item, index) => <li key={index}>{item}</li>)}</ul>;
      },
    },
    {
      Header: "Rented Date",
      accessor: "rentedDate",
      Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      Header: "Vacated Date",
      accessor: "vacatedDate",
      Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    {
      Header: "Floor ID",
      accessor: "floorId",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Unit List</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-base-100 shadow-md rounded-lg">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-base-300">
                {columns.map((column) => (
                  <th key={column.Header} className="px-4 py-2 text-left">{column.Header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id} className="border-b">
                  {columns.map((column) => (
                    <td key={column.Header} className="px-4 py-2">
                      {column.Cell ? column.Cell({ value: unit[column.accessor] }) : unit[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UnitList;
