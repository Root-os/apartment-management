import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import Modal from "../../components/Modal";
import HistoryModal from "./HistoryModal";
import SmartDateInput from "../../components/Common/smartDatePicker";
import { CalendarContext } from "../../context/calendarContext";
import api from "../../utils/api";

const RentCollectionPage = () => {
  const [rentData, setRentData] = useState([]);
  const [tenantData, setTenantData] = useState([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [tenantInfo, setTenantInfo] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentRent, setCurrentRent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");
  const [noDataMessage, setNoDataMessage] = useState(false);

  const [tenantList, setTenantList] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState([]);

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptForm, setReceiptForm] = useState({
    id: null,
    rentCollectionId: null,
    status: "pending",
    fsNo: "",
    deliveryStatus: "pending",
  });

  const [filterParams, setFilterParams] = useState({
    paymentDateFrom: "",
    paymentDateTo: "",
    nextDueDateFrom: "",
    nextDueDateTo: "",
    paymentFrequency: "",
    status: "",
    tenantId: "",
    paymentTypeId: "",
  });

  const { formatDateForDisplay } = useContext(CalendarContext);

  // Fetch Rent Collection Data
  const fetchRentData = async () => {
    try {
      const response = await api.get(`rent-collection`);
      setRentData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rent data:", error);
      setLoading(false);
    }
  };

  // Fetch Tenant Data
  const fetchTenantData = async () => {
    try {
      const response = await api.get(`tenant`);
      setTenantData(response.data);
    } catch (error) {
      console.error("Error fetching tenant data:", error);
    }
  };

  const fetchUniqueTenants = async () => {
    try {
      const response = await api.get("tenant/floor-units");
      const tenants = [];

      response.data.forEach((t) => {
        // Pick the first tenant record for this phone number
        if (t.tenant?.length > 0) {
          tenants.push({
            phoneNumber: t.phoneNumber,
            fullName: t.fullName,
            tenantId: t.tenant[0].tenantId, // first lease tenantId
          });
        }
      });

      setTenantList(tenants);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

  const fetchPaymentTypes = async () => {
    try {
      const res = await api.get(`payment-settings`);
      setPaymentTypes(res.data.data);
    } catch (error) {
      console.error("Error fetching payment types:", error);
    }
  };

  useEffect(() => {
    fetchRentData();
    fetchTenantData();
    fetchUniqueTenants();
    fetchPaymentTypes();
  }, []);

  useEffect(() => {
    if (currentRent?.tenantId) {
      const tenant = tenantData.find((t) => t.id === currentRent.tenantId);
      if (tenant) {
        setCurrentRent((prev) => ({
          ...prev,
          tenantRent: tenant.amount, // store tenant rent in currentRent
        }));
      }
    }
  }, [currentRent?.tenantId]);

  useEffect(() => {
    if (
      currentRent?.paymentDate &&
      currentRent?.nextDueDate &&
      currentRent?.tenantRent
    ) {
      const start = new Date(currentRent.paymentDate);
      const end = new Date(currentRent.nextDueDate);

      // Force midnight UTC for consistency
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

      const amount = (currentRent.tenantRent / 30) * diffDays;

      setCurrentRent((prev) => ({
        ...prev,
        paidDays: diffDays,
        amountPaid: amount.toFixed(2),
      }));
    }
  }, [
    currentRent?.paymentDate,
    currentRent?.nextDueDate,
    currentRent?.tenantRent,
  ]);

  // Handle history modal open
  const openHistoryModal = async (id) => {
    try {
      const response = await api.get(`rent-collection/${id}`);
      setPaymentHistory(response.data.rentPayments);
      setTenantInfo(response.data.tenant);
      setHistoryModalOpen(true);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setModalMessage("Error fetching payment history. Please try again.");
      setIsErrorModalOpen(true);
    }
  };

  // Handle edit modal open
  const openEditModal = (rent) => {
    const tenant = tenantData.find((t) => t.id === rent.tenantId);

    // Convert dates to YYYY-MM-DD format for SmartDateInput
    const paymentDate = rent.paymentDate
      ? new Date(rent.paymentDate).toISOString().split("T")[0]
      : "";
    const nextDueDate = rent.nextDueDate
      ? new Date(rent.nextDueDate).toISOString().split("T")[0]
      : "";

    setCurrentRent({
      ...rent,
      tenantRent: tenant ? tenant.amount : 0,
      paymentDate,
      nextDueDate,
      description: rent.description || "",
    });

    setEditModalOpen(true);
  };

  // Handle delete modal open
  const openDeleteModal = (rentId) => {
    setCurrentRent(rentId);
    setDeleteModalOpen(true);
  };

  // Handle details modal open
  const openDetailsModal = (rent) => {
    setCurrentRent(rent);
    setDetailsModalOpen(true);
  };

  // Handle Close Modals
  const closeModals = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setDetailsModalOpen(false);
    setHistoryModalOpen(false);
  };

  // Handle Edit Form Submission (PUT Request)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (new Date(currentRent.nextDueDate) < new Date(currentRent.paymentDate)) {
      setModalMessage("Next due date cannot be earlier than payment date");
      setIsErrorModalOpen(true);
      return;
    }
    try {
      const updatedRent = {
        tenantId: currentRent.tenantId,
        paymentDate: currentRent.paymentDate,
        nextDueDate: currentRent.nextDueDate,
        paidDays: currentRent.paidDays,
        amountPaid: currentRent.amountPaid,
        paymentTypeId: currentRent.paymentTypeId,
        status: currentRent.status,
        isPaid: currentRent.isPaid,
        punishment: currentRent.punishment,
        description: currentRent.description,
      };
      await api.put(`rent-collection/${currentRent.id}`, updatedRent);
      fetchRentData();
      closeModals();
      setModalOpen(true);
      setMessageType("success");
      setMessage("Rent updated successfully!");
    } catch (error) {
      console.error("Error updating rent data:", error);
      setModalOpen(true);
      setMessageType("error");
      setMessage("Error updating rent. Please try again.");
    }
  };

  // Handle Rent Deletion (DELETE Request)
  const handleDeleteRent = async () => {
    try {
      await api.delete(`rent-collection/${currentRent}`);
      fetchRentData();
      closeModals();
      setModalOpen(true);
      setMessageType("success");
      setMessage("Rent deleted successfully!");
    } catch (error) {
      console.error("Error deleting rent data:", error);
      setModalOpen(true);
      setMessageType("error");
      setMessage("Error deleting rent data. Please try again.");
    }
  };

  const cleanFilterParams = (params) => {
    const cleaned = {};
    for (const key in params) {
      if (params[key] !== "") {
        cleaned[key] = params[key];
      }
    }
    return cleaned;
  };

  // Handle Filter Submit
  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setFilterLoading(true);
    // Clean filter params once
    const cleanedParams = cleanFilterParams(filterParams);

    // Convert tenantId to number if exists
    if (cleanedParams.tenantId) {
      cleanedParams.tenantId = Number(cleanedParams.tenantId);
    }

    console.log("FILTER PAYLOAD BEING SENT:", cleanedParams);

    try {
      const response = await api.post(`rent-collection/filter`, cleanedParams);

      console.log("Filter Response:", response.data);

      if (
        response.data.message ===
        "No rent collections found matching the filters"
      ) {
        setRentData([]);
        setNoDataMessage(true);
      } else {
        setRentData(response.data);
        setNoDataMessage(false);
      }
    } catch (error) {
      console.error("Error filtering rent collections:", error);
      setNoDataMessage(true);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilterParams({
      paymentDateFrom: "",
      paymentDateTo: "",
      nextDueDateFrom: "",
      nextDueDateTo: "",
      status: "",
      tenantId: "",
      paymentTypeId: "",
    });
  };

  // For regular inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterParams({ ...filterParams, [name]: value });
  };

  // For SmartDateInput components
  const handleDateChange = (name) => (value) => {
    setFilterParams({ ...filterParams, [name]: value });
  };

  const openReceiptModal = async (rent) => {
    try {
      const res = await api.get(`rent-receipt/rentCollection/${rent.id}`);

      setReceiptForm({
        id: res.data.id,
        rentCollectionId: res.data.rentCollectionId,
        status: res.data.status,
        fsNo: res.data.fsNo || "",
        deliveryStatus: res.data.deliveryStatus,
      });
    } catch (error) {
      setReceiptForm({
        id: null,
        rentCollectionId: rent.id,
        status: "pending",
        fsNo: "",
        deliveryStatus: "pending",
      });
    }

    setReceiptModalOpen(true);
  };

  const handleSaveReceipt = async () => {
    try {
      if (receiptForm.id) {
        await api.put(`rent-receipt/${receiptForm.id}`, receiptForm);
      } else {
        await api.post(`rent-receipt`, receiptForm);
      }

      setReceiptModalOpen(false);

      setModalOpen(true);
      setMessageType("success");
      setMessage("Receipt saved successfully!");
    } catch (error) {
      setModalOpen(true);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Error saving receipt");
    }
  };

  // const handleDeleteReceipt = async () => {
  //   try {
  //     await api.delete(`rent-receipt/${receiptForm.id}`);
  //     setReceiptModalOpen(false);
  //     setModalOpen(true);
  //     setMessageType("success");
  //     setMessage("Receipt deleted successfully!");
  //   } catch (error) {
  //     setModalOpen(true);
  //     setMessageType("error");
  //     setMessage("Error deleting receipt");
  //   }
  // };

  const columns = [
    {
      key: "tenantName",
      label: "Tenant Name",
      render: (rent) => rent.Tenant?.fullName || "N/A",
      searchValue: (rent) => rent?.Tenant?.fullName || '',
    },
    {
      key: "floorNumber",
      label: "Floor",
      render: (rent) => rent.Tenant?.Floor?.floorNumber || "N/A",
      
    },
    {
      label: "Unit Number",
      key: "unitNumber",
      render: (rent) => rent?.Tenant?.Unit?.unitNumber || "N/A",
    },
    {
      key: "paymentDate",
      label: "Paid From",
      render: (rent) => formatDateForDisplay(rent.paymentDate),
    },
    {
      key: "nextDueDate",
      label: "Paid To",
      render: (rent) => formatDateForDisplay(rent.nextDueDate),
    },
    { key: "status", label: "Payment status" },
    { key: "paidDays", label: "paid days" },
    {
      key: "amountPaid",
      label: "Amount Paid",
      render: (rent) => Number(rent.amountPaid).toFixed(2),
    },
    {
      key: "actions",
      label: "Actions",
      render: (rent) => (
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => openEditModal(rent)}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => openDeleteModal(rent.id)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => openDetailsModal(rent)}
            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            Details
          </button>
          {/* <button
              onClick={() => openHistoryModal(rent.id)}
              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
            >
              Payment History
            </button> */}
          <button
            onClick={() => openReceiptModal(rent)}
            className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
          >
            Receipt
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <form
        onSubmit={handleFilterSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
      >
        <div>
          <label
            htmlFor="paymentDateFrom"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Payment Date From
          </label>
          <SmartDateInput
            id="paymentDateFrom"
            name="paymentDateFrom"
            value={filterParams.paymentDateFrom}
            onChange={handleDateChange("paymentDateFrom")}
          />
        </div>
        <div>
          <label
            htmlFor="paymentDateTo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Payment Date To
          </label>
          <SmartDateInput
            id="paymentDateTo"
            name="paymentDateTo"
            value={filterParams.paymentDateTo}
            onChange={handleDateChange("paymentDateTo")}
          />
        </div>
        <div>
          <label
            htmlFor="nextDueDateFrom"
            className="dark:text-gray-300 block text-sm font-medium text-gray-700"
          >
            Next Due Date From
          </label>
          <SmartDateInput
            id="nextDueDateFrom"
            name="nextDueDateFrom"
            value={filterParams.nextDueDateFrom}
            onChange={handleDateChange("nextDueDateFrom")}
          />
        </div>
        <div>
          <label
            htmlFor="nextDueDateTo"
            className="dark:text-gray-300 block text-sm font-medium text-gray-700"
          >
            Next Due Date To
          </label>
          <SmartDateInput
            id="nextDueDateTo"
            name="nextDueDateTo"
            value={filterParams.nextDueDateTo}
            onChange={handleDateChange("nextDueDateTo")}
          />
        </div>
        <div>
          <label
            htmlFor="tenantId"
            className="dark:text-gray-300 block text-sm font-medium text-gray-700"
          >
            Tenant
          </label>
          <select
            id="tenantId"
            name="tenantId"
            value={filterParams.tenantId || ""}
            onChange={(e) =>
              setFilterParams((prev) => ({ ...prev, tenantId: e.target.value }))
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Tenant</option>
            {tenantList.map((tenant) => (
              <option key={tenant.tenantId} value={tenant.tenantId}>
                {tenant.fullName} ({tenant.phoneNumber})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="paymentTypeId"
            className="dark:text-gray-300 block text-sm font-medium text-gray-700"
          >
            Payment Method
          </label>

          <select
            id="paymentTypeId"
            name="paymentTypeId"
            value={filterParams.paymentTypeId}
            onChange={(e) =>
              setFilterParams((prev) => ({
                ...prev,
                paymentTypeId: e.target.value,
              }))
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Payment Method</option>

            {paymentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.paymentMethod}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="status"
            className=" dark:text-gray-300 block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filterParams.status}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending by Tenants</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleResetFilters}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Reset
          </button>

          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center`}
            disabled={filterLoading}
          >
            {filterLoading ? "Filtering..." : "Filter Data"}
          </button>
        </div>
      </form>

      <TableComponent
        title="Rent Collection"
        data={rentData}
        columns={columns}
        showSearch={true}
        exportable={true}
        exportConfig={[
    {
      label: "Tenant Name",
      getValue: (r) => r.Tenant?.fullName ?? "N/A",
    },
    {
      label: "Phone Number",
      getValue: (r) => r.Tenant?.phoneNumber ?? "N/A",
    },
    {
      label: "Unit Number",
      getValue: (r) => r.Tenant?.Unit?.unitNumber ?? "N/A",
    },
    {
      label: "Floor",
      getValue: (r) => r.Tenant?.Floor?.floorNumber ?? "N/A",
    },
    {
      label: "Amount Paid",
      getValue: (r) => r.amountPaid ?? 0,
    },
    {
      label: "Extra Amount",
      getValue: (r) => r.extraAmount ?? 0,
    },
    {
      label: "Paid Days",
      getValue: (r) => r.paidDays ?? 0,
    },
    {
      label: "Payment Method",
      getValue: (r) => r.PaymentSetting?.paymentMethod ?? "N/A",
    },
    {
      label: "Payment Date",
      getValue: (r) =>
        r.paymentDate
          ? new Date(r.paymentDate).toLocaleDateString()
          : "N/A",
    },
    {
      label: "Next Due Date",
      getValue: (r) =>
        r.nextDueDate
          ? new Date(r.nextDueDate).toLocaleDateString()
          : "N/A",
    },
    {
      label: "Status",
      getValue: (r) => r.status ?? "N/A",
    },
    {
      label: "Punishment",
      getValue: (r) => r.punishment ?? 0,
    },
  ]}
      />

      {rentData.length === 0 && noDataMessage && (
        <p className="text-center text-gray-500 mt-4">
          No data available for the selected filters.
        </p>
      )}

      {/* History Modal */}
      {historyModalOpen && (
        <HistoryModal
          isOpen={historyModalOpen}
          onClose={closeModals}
          tenantInfo={tenantInfo}
          paymentHistory={paymentHistory}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl mb-4">Edit Rent Collection</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tenant</label>
                <select
                  value={currentRent?.tenantId || ""}
                  onChange={(e) =>
                    setCurrentRent({ ...currentRent, tenantId: e.target.value })
                  }
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Tenant</option>
                  {tenantData.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label>Payment Date</label>
                <SmartDateInput
                  value={currentRent?.paymentDate || ""}
                  onChange={(date) =>
                    setCurrentRent((prev) => ({ ...prev, paymentDate: date }))
                  }
                />
              </div>
              <div className="mb-4">
                <label>Next Due Date</label>
                <SmartDateInput
                  value={currentRent?.nextDueDate || ""}
                  onChange={(date) =>
                    setCurrentRent((prev) => ({ ...prev, nextDueDate: date }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Amount Paid
                </label>
                <input
                  type="number"
                  value={currentRent?.amountPaid || ""}
                  readOnly
                  onChange={(e) =>
                    setCurrentRent({
                      ...currentRent,
                      amountPaid: e.target.value,
                    })
                  }
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Payment Method
                </label>

                <select
                  value={currentRent?.paymentTypeId || ""}
                  onChange={(e) =>
                    setCurrentRent({
                      ...currentRent,
                      paymentTypeId: parseInt(e.target.value),
                    })
                  }
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select payment method</option>

                  {paymentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.paymentMethod}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={currentRent?.status || ""}
                  onChange={(e) =>
                    setCurrentRent({ ...currentRent, status: e.target.value })
                  }
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              {/* Punishment */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Punishment</label>
                <input
                  type="number"
                  value={currentRent?.punishment || 0}
                  onChange={(e) =>
                    setCurrentRent({ ...currentRent, punishment: parseFloat(e.target.value) })
                  }
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                />
              </div> */}

              {/* Is Paid */}
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={currentRent?.isPaid || false}
                  onChange={(e) =>
                    setCurrentRent({ ...currentRent, isPaid: e.target.checked })
                  }
                  className="mr-2"
                />
                <label htmlFor="isPaid" className="text-sm font-medium">
                  Is Paid
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>

                <textarea
                  value={currentRent?.description || ""}
                  onChange={(e) =>
                    setCurrentRent({
                      ...currentRent,
                      description: e.target.value,
                    })
                  }
                  className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                  rows={3}
                  placeholder="Add notes (optional)"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModals}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  className="bg-blue-500 ..."
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-lg mx-4">
            <h2 className="text-xl mb-4">
              Are you sure you want to delete this rent collection?
            </h2>
            <div className="flex justify-end space-x-1">
              <button
                onClick={closeModals}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRent}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailsModalOpen && currentRent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-2xl mx-4">
            <h2 className="text-xl mb-4">
              Details for {currentRent.Tenant?.fullName || "N/A"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <strong>Tenant Name:</strong>{" "}
                {currentRent.Tenant?.fullName || "N/A"}
              </p>
              <p>
                <strong>Phone Number:</strong>{" "}
                {currentRent.Tenant?.phoneNumber || "N/A"}
              </p>
              <p>
                <strong>Tenant Email:</strong>{" "}
                {currentRent.Tenant?.email || "No Email"}
              </p>
              <p>
                <strong>Paid From:</strong>{" "}
                {formatDateForDisplay(currentRent.paymentDate)}
              </p>
              <p>
                <strong>Floor Number:</strong>{" "}
                {currentRent.Tenant?.Floor?.floorNumber || "N/A"}
              </p>
              <p>
                <strong>Paid To:</strong>{" "}
                {formatDateForDisplay(currentRent.nextDueDate)}
              </p>
              <p>
                <strong>Unit Number:</strong>{" "}
                {currentRent.Tenant?.Unit?.unitNumber || "N/A"}
              </p>
              <p>
                <strong>Paid Days:</strong> {currentRent.paidDays}
              </p>
              <p>
                <strong>Next Due Date:</strong>{" "}
                {formatDateForDisplay(currentRent.nextDueDate)}
              </p>
              <p>
                <strong>Payment Statuss:</strong> {currentRent.status}
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {currentRent.PaymentSetting?.paymentMethod || "N/A"}
              </p>
              <p>
                <strong>Amount Paid:</strong>{" "}
                {currentRent.amountPaid?.toLocaleString() || 0} ETB
              </p>

              <p>
                <strong>Extra Amount:</strong>{" "}
                {currentRent.extraAmount?.toLocaleString() || 0} ETB
              </p>
              <p>
                <strong>Punishment:</strong> {currentRent.punishment}
              </p>
              <p>
                <strong>Is Paid:</strong> {currentRent.isPaid ? "Yes" : "No"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {currentRent?.description || "N/A"}
              </p>
              <p>
                <strong>Attachment:</strong>{" "}
                {currentRent.attachment ? (
                  <a
                    href={currentRent.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Attachment
                  </a>
                ) : (
                  "No Attachment"
                )}
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={closeModals}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {receiptModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl mb-4">
              {receiptForm.id ? "Edit Receipt" : "Create Receipt"}
            </h2>

            {/* STATUS */}
            <div className="mb-4">
              <label>Status</label>
              <select
                value={receiptForm.status}
                onChange={(e) =>
                  setReceiptForm({ ...receiptForm, status: e.target.value })
                }
                className={`w-full p-2 border rounded
      ${
        receiptForm.status === "cutted"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }
    `}
              >
                <option value="pending">Pending</option>
                <option value="cutted">Cutted</option>
              </select>
            </div>

            {/* FS NUMBER */}
            <div className="mb-4">
              <label>FS Number</label>
              <input
                type="text"
                value={receiptForm.fsNo}
                onChange={(e) =>
                  setReceiptForm({ ...receiptForm, fsNo: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter FS Number"
                // Editable if status is 'cutted' OR if editing an existing receipt
                disabled={receiptForm.status !== "cutted" && !receiptForm.id}
              />
            </div>

            {/* DELIVERY STATUS */}
            <div className="mb-4">
              <label>Delivery Status</label>
              <select
                value={receiptForm.deliveryStatus}
                onChange={(e) =>
                  setReceiptForm({
                    ...receiptForm,
                    deliveryStatus: e.target.value,
                  })
                }
                className={`w-full p-2 border rounded
                  ${
                    receiptForm.deliveryStatus === "delivered"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                `}
                disabled={receiptForm.status !== "cutted" || !receiptForm.fsNo}
              >
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between">
              {/* LEFT SIDE (DELETE) */}
              {/* {receiptForm.id && (
                <button
                  onClick={handleDeleteReceipt}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              )} */}

              {/* RIGHT SIDE */}
              <div className="flex gap-2">
                <button
                  onClick={() => setReceiptModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveReceipt}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {receiptForm.id ? "Update" : "Create"}
                </button>
              </div>
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

export default RentCollectionPage;
