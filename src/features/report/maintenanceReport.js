import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import Modal from "../../components/Modal";
import LoadingComponent from "../../components/loading";
import SmartDateInput from "../../components/Common/smartDatePicker";

const MaintenanceReport = () => {
  const [maintenanceData, setMaintenanceData] = useState([]); // Store maintenance data
  const [unitList, setUnitList] = useState([]); // Store list of units
  const [itemList, setItemList] = useState([]); // Store list of items
  const [filterParams, setFilterParams] = useState({
    startDate: "",
    unitId: "", 
    itemId: "", 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch unit list on component mount
  useEffect(() => {
    const fetchUnitList = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}unit`
        );
        if (response.data && Array.isArray(response.data)) {
          setUnitList(response.data); // Store units in state
        } else {
          console.error("Invalid unit data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching unit list:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch item list on component mount
    const fetchItemList = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}items`
        );
        if (response.data && Array.isArray(response.data)) {
          setItemList(response.data);
        } else {
          console.error("Invalid item data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching item list:", error);
      }
    };

    fetchUnitList();
    fetchItemList();
  }, []);

  // Handle filter submit
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}maintenance/report`,
        filterParams
      );

      // Log response data for debugging
      console.log("API response:", response.data);

      // Ensure the response is an array, otherwise set it to an empty array
      const data = Array.isArray(response.data) ? response.data : [];
      setMaintenanceData(data);
    } catch (error) {
      const message =
        error.response?.status === 404
          ? "No maintenance data found with the given filters."
          : "Error filtering data. Please try again.";
      setModalMessage(message);
      setIsModalOpen(true);
      console.error("Error filtering data:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleResetFilters = () => {
    setFilterParams({
    startDate: "",
    unitId: "", 
    itemId: "", 
    });
  };

 const columns = [
  {
    key: "maintenanceUnit.unitNumber",
    label: "Unit Number",
    render: (item) => item?.maintenanceUnit?.unitNumber || "N/A",
  },
  {
    key: "name", 
    label: "Name",
    render: (item) =>
      item.isItem
        ? item?.maintenanceItem?.itemName || "N/A"
        : item?.name || "N/A",
  },
  {
    key: "maintenanceDate",
    label: "Maintenance Date",
    isDate: true,
  },
  // { key: "status", label: "Status" },
  { key: "cost", label: "Maintenance Cost" },
  { key: "description", label: "Description" },
];

  return (
    <div className="p-8 w-full">
      <div className="container mx-auto p-4">
        {/* Filter form */}
        <form
          onSubmit={handleFilterSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
        >
          {/* Start Date */}
          <div className="min-w-[120px]">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Maintenance Date
            </label>
            <SmartDateInput
              id="startDate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.startDate}
              onChange={(date) =>
                setFilterParams({ ...filterParams, startDate: date })
              }
            />
          </div>

          {/* Unit ID Dropdown */}
          <div className="min-w-[100px]">
            <label
              htmlFor="unitId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Unit
            </label>
            <select
              id="unitId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.unitId}
              onChange={(e) =>
                setFilterParams({ ...filterParams, unitId: e.target.value })
              }
            >
              <option value="">Select Unit</option>
              {unitList.length > 0 ? (
                unitList.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unitNumber || "Unnamed Unit"}{" "}
                    {/* Use fallback name */}
                  </option>
                ))
              ) : (
                <option value="">No units available</option>
              )}
            </select>
          </div>

          {/* Item ID Dropdown */}
          <div className="min-w-[100px]">
            <label
              htmlFor="itemId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Item
            </label>
            <select
              id="itemId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.itemId}
              onChange={(e) =>
                setFilterParams({ ...filterParams, itemId: e.target.value })
              }
            >
              <option value="">Select Item</option>
              {itemList.length > 0 ? (
                itemList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.itemName || "Unnamed Item"} {/* Use fallback name */}
                  </option>
                ))
              ) : (
                <option value="">No items available</option>
              )}
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Reset
            </button>
            <button
              type="submit"
              className="w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:text-gray-300"
            >
              {isLoading ? "Processing..." : "Filter Data"}
            </button>
          </div>
        </form>
      </div>
      {/* Table for displaying maintenance report */}
      {loading ? (
        <LoadingComponent />
      ) : maintenanceData.length > 0 ? (
        <TableComponent
          title="Maintenance Report"
          data={maintenanceData || []} // Ensure the data is always an array
          columns={columns}
         rowsPerPageOptions={[5, 10, 15]}

          showSearch={true}
          exportable={true}
        />
      ) : (
        <div>
          <p>No data available for the selected filters.</p>
          <TableComponent
            title="Maintenance Report"
            data={maintenanceData || []} // Ensure the data is always an array
            columns={columns}
           rowsPerPageOptions={[5, 10, 15]}

            showSearch={true}
            exportable={true}
            exportConfig={[
  {
    label: "Unit Number",
    getValue: (r) => r.maintenanceUnit?.unitNumber ?? "N/A",
  },
  {
    label: "Name",
    getValue: (r) =>
      r.isItem
        ? r.maintenanceItem?.itemName ?? "N/A"
        : r.name ?? "N/A",
  },
  {
    label: "Maintenance Date",
    getValue: (r) =>
      r.maintenanceDate
        ? new Date(r.maintenanceDate).toLocaleDateString()
        : "N/A",
  },
  {
    label: "Maintenance Cost",
    getValue: (r) => r.cost ?? 0,
  },
  // {
  //   label: "Description",
  //   getValue: (r) => r.description ?? "",
  // },
]}
          />
        </div>
      )}
      {/* Modal for displaying error message */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type="error"
          message={modalMessage}
        />
      )}
    </div>
  );
};

export default MaintenanceReport;
