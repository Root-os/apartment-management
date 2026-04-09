import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import Modal from "../../components/Modal";
import LoadingComponent from "../../components/loading";
import { useNavigate } from "react-router-dom";
import { CalendarContext } from "../../context/calendarContext";
import SmartDateInput from "../../components/Common/smartDatePicker";
import api from "../../utils/api";
import normalizeDate from "../../utils/normalizedDate";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [floors, setFloors] = useState([]);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [unitDetails, setUnitDetails] = useState(null);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});

  const { formatDateForDisplay } = useContext(CalendarContext);
  const { isGregorian } = useContext(CalendarContext);

  const navigate = useNavigate();

  const [editData, setEditData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    nationalId: "",
    leaseStartDate: "",
    leaseEndDate: "",
    contractEndDate: "",
    paymentStatus: "",
    additionalNotes: "",
    unitId: "",
    floorId: "",
    advance: "",
    amount: "",
    tin: "",
    document: "",
    status: "",
    description: "",
    carName: "",
    carPlate: "",
    // color: "",
  });

  // Loading and Saving States
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    messageType: "",
    message: "",
  });

  // Fetch tenant data, units, and floors from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tenantResponse = await api.get(`tenant`);
        setTenants(tenantResponse.data);

        const floorResponse = await api.get(`floor`);
        setFloors(floorResponse.data);

        setIsPageLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchFreeUnits = async (floorId) => {
    try {
      const response = await api.get(`floor/${floorId}`);
      console.log("Fetched freeUnits:", response.data);
      setUnits(
        Array.isArray(response.data.freeUnits) ? response.data.freeUnits : [],
      );
    } catch (err) {
      setError("Failed to fetch freeUnits.");
    }
  };

  const fetchUnitDetails = async (unitId) => {
    try {
      const response = await api.get(`unit/${unitId}`);
      const rent = response.data?.taxedRentAmount || "";
      setAmount(rent); // auto-fill rent input
    } catch (err) {
      console.error("Failed to fetch unit details:", err);
      setError((prev) => ({ ...prev, api: "Failed to fetch unit rent." }));
    }
  };

  // Handle file change for document upload
  const handleFileChange = (e) => {
    setEditData({ ...editData, document: e.target.files[0] });
  };

  // Edit modal: Set initial values when edit button is clicked
  const handleEditClick = (tenant) => {
    setSelectedTenant(tenant);
    setEditData({
      fullName: tenant.fullName,
      phoneNumber: tenant.phoneNumber,
      email: tenant.email,
      nationalId: tenant.nationalId,
      leaseStartDate: normalizeDate(tenant.leaseStartDate),
      leaseEndDate: normalizeDate(tenant.leaseEndDate),
      contractEndDate: normalizeDate(tenant.contractEndDate),
      additionalNotes: tenant.additionalNotes || "",
      unitId: tenant.unitId || "",
      floorId: tenant.floorId || "",
      advance: tenant.advance || "",
      amount: tenant.amount || "",
      tin: tenant.tin || "",
      document: tenant.document || "",
      status: tenant.status || "active",
      resetPassword: false,
    });

    // Fetch units for the current floor if floorId exists
    if (tenant.floorId) {
      fetchFreeUnits(tenant.floorId);
    }

    setIsEditModalOpen(true);
  };

  // Delete modal: Set selected tenant for deletion
  const handleDeleteClick = (tenant) => {
    setSelectedTenant(tenant);
    setIsDeleteModalOpen(true);
  };

  const handleUnitClick = async (unitId) => {
    try {
      const { data } = await api.get(`tenant/unit/${unitId}`);

      const tenant = data[0];

      setUnitDetails({
        ...tenant,
        Unit: tenant?.Unit ?? {
          unitNumber: "",
          size: null,
          status: "",
          availableEquipments: "[]",
          problems: "[]",
          rentedDate: null,
        },
      });

      setIsUnitModalOpen(true);
    } catch (err) {
      setError("Failed to fetch unit details.");
    }
  };

  // Handle form submit
  const handleEditSubmit = async () => {
    try {
      if (!editData.fullName || !editData.phoneNumber) {
        setModal({
          isOpen: true,
          messageType: "error",
          message: "Please fill in all required fields",
        });
        return;
      }

      setIsSaving(true);

      const normalizedData = {
        ...editData,
        status: editData.status?.toLowerCase() || "active",
        unitId: editData.unitId ? Number(editData.unitId) : null,
        floorId: editData.floorId ? Number(editData.floorId) : null,
      };

      const formData = new FormData();

      Object.keys(normalizedData).forEach((key) => {
        if (key === "document" && normalizedData[key] instanceof File) {
          formData.append(key, normalizedData[key]);
        } else if (
          normalizedData[key] !== null &&
          normalizedData[key] !== undefined
        ) {
          formData.append(key, normalizedData[key]);
        }
      });

      if (editData.resetPassword) {
        formData.set("resetPassword", "true");
      }

      const validationErrors = validateEditData(editData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const response = await api.put(`tenant/${selectedTenant.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ SINGLE modal decision
      setModal({
        isOpen: true,
        messageType: "success",
        message: response.data.newPassword
          ? `Tenant updated successfully.\nNew password: ${response.data.newPassword}`
          : "Tenant updated successfully",
      });

      const updatedTenants = tenants.map((t) =>
        t.id === selectedTenant.id ? response.data : t,
      );
      setTenants(updatedTenants);
      setIsEditModalOpen(false);
    } catch (error) {
      setModal({
        isOpen: true,
        messageType: "error",
        message: error.response?.data?.message || "Failed to update tenant",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Submit delete request to the API
  const handleDeleteSubmit = async () => {
    try {
      await api.delete(`tenant/${selectedTenant.id}`);
      setTenants(tenants.filter((tenant) => tenant.id !== selectedTenant.id));
      setIsDeleteModalOpen(false);
      setModal({
        isOpen: true,
        messageType: "success",
        message: "Tenant deleted successfully.",
      });
    } catch (err) {
      setModal({
        isOpen: true,
        messageType: "error",
        message: "Failed to delete tenant.",
      });
    }
  };

  // Close modal
  const closeModal = () => {
    setModal({ isOpen: false, messageType: "", message: "" });
  };

  const handleAddClick = () => {
    window.location.href = "/app/tenant-add";
  };
  // Handle opening of the details modal
  const handleDetailsClick = (tenant) => {
    setSelectedTenant(tenant);
    setIsDetailsModalOpen(true);
  };

  const handleCarClick = (tenant) => {
    if (tenant.TenantVehicles.length > 0) {
      navigate(`/app/tenant/${tenant.id}/vehicles`);
    } else {
      navigate("/app/add-tenant-vehicle", { state: { tenantId: tenant.id } });
    }
  };
  const validateEditData = (data) => {
    const errors = {};

    // ---- Lease dates ----
    if (
      data.leaseStartDate &&
      data.leaseEndDate &&
      new Date(data.leaseEndDate) < new Date(data.leaseStartDate)
    ) {
      errors.leaseEndDate = "Lease end date cannot be before lease start date";
    }

    if (
      data.leaseStartDate &&
      data.contractEndDate &&
      new Date(data.contractEndDate) < new Date(data.leaseStartDate)
    ) {
      errors.contractEndDate =
        "Contract end date cannot be before lease start date";
    }

    // ---- TIN ----
    if (data.tin) {
      if (!/^\d+$/.test(data.tin)) {
        errors.tin = "TIN must contain digits only";
      } else if (data.tin.length !== 10) {
        errors.tin = "TIN must be exactly 10 digits";
      }
    }

    return errors;
  };

  return (
    <div>
      {/* Page Loading */}
      {isPageLoading ? (
        <LoadingComponent />
      ) : (
        <TableComponent
          title="Tenant List"
          data={tenants}
          onAdd={handleAddClick}
          columns={[
            {
              label: "Full Name",
              key: "fullName",
            },
            {
              label: "Phone Number",
              key: "phoneNumber",
            },
            {
              label: "rent",
              key: "amount",
            },
            {
              label: "Advance",
              key: "advance",
            },
            {
              label: "Unit Number",
              key: "unitNumber",
              render: (row) => row.Unit?.unitNumber || "N/A",
            },
            {
              label: "Floor",
              key: "floorNumber",
              render: (row) => row.Floor?.floorNumber || "N/A",
            },
            {
              label: "Rent Remaining Days",
              key: "remainingDays",
              render: (row) => {
                if (!row.leaseEndDate) return "Not specified";

                const today = new Date();
                const leaseEnd = new Date(row.leaseEndDate);

                if (isNaN(leaseEnd)) return "Invalid date";

                today.setHours(0, 0, 0, 0);
                leaseEnd.setHours(0, 0, 0, 0);

                const diffTime = leaseEnd - today;
                let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 0) {
                  // inclusive: count today + end date
                  diffDays += 1;

                  const daysText = diffDays === 1 ? "day" : "days";
                  const text = `${diffDays} ${daysText} remaining`;

                  return (
                    <span style={{ color: diffDays <= 10 ? "red" : "inherit" }}>
                      {text}
                    </span>
                  );
                }

                // Past
                const passedDays = Math.abs(diffDays);
                const daysText = passedDays === 1 ? "day" : "days";

                return `${passedDays} ${daysText} passed`;
              },
            },

            {
              label: "Contract Remaining Days",
              key: "contractRemainingDays",
              render: (row) => {
                if (!row.contractEndDate) return "Not specified";

                const today = new Date();
                const contractEnd = new Date(row.contractEndDate);

                if (isNaN(contractEnd)) return "Invalid date";

                today.setHours(0, 0, 0, 0);
                contractEnd.setHours(0, 0, 0, 0);

                const diffTime = contractEnd - today;
                let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 0) {
                  diffDays += 1; // ✅ inclusive
                  const daysText = diffDays === 1 ? "day" : "days";
                  return `${diffDays} ${daysText} remaining`;
                }

                const passedDays = Math.abs(diffDays);
                const daysText = passedDays === 1 ? "day" : "days";
                return `${passedDays} ${daysText} passed`;
              },
            },
            {
              label: "Actions",
              key: "actions",
              render: (row) => {
                const isInactive = row.status?.toLowerCase() !== "active";

                return (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDetailsClick(row)}
                      className="bg-gray-400 text-white py-1 px-2 rounded"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEditClick(row)}
                      className="bg-blue-500 text-white py-1 px-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(row)}
                      className="bg-red-500 text-white py-1 px-2 rounded"
                    >
                      Delete
                    </button>

                    {/* Disable other buttons if inactive */}
                    <button
                      onClick={() => handleUnitClick(row.Unit.id)}
                      className={`bg-green-500 text-white py-1 px-2 rounded ${isInactive ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isInactive}
                    >
                      Units
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/app/rent-collection-add?tenantId=${row.id}`)
                      }
                      className={`bg-indigo-500 text-white py-1 px-2 rounded ${isInactive ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isInactive}
                    >
                      Rent
                    </button>
                    <button
                      onClick={() => handleCarClick(row)}
                      className={`bg-yellow-500 text-white py-1 px-2 rounded ${isInactive ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isInactive}
                    >
                      Car
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/app/tenant-bill-add?tenantId=${row.id}`)
                      }
                      className={`bg-gray-700 text-white py-1 px-2 rounded ${isInactive ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isInactive}
                    >
                      Bill
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/app/add-in-out?tenantId=${row.id}`)
                      }
                      className={`bg-pink-400 text-white py-1 px-2 rounded ${isInactive ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isInactive}
                    >
                      Item
                    </button>
                  </div>
                );
              },
            },
          ]}
          exportConfig={[
            { label: "Full Name", getValue: (r) => r.fullName },
            { label: "Phone Number", getValue: (r) => r.phoneNumber },

            { label: "Email", getValue: (r) => r.email ?? "N/A" },
            { label: "National ID", getValue: (r) => r.nationalId ?? "N/A" },
            { label: "TIN", getValue: (r) => r.tin ?? "N/A" },

            { label: "Rent", getValue: (r) => r.amount },
            { label: "Advance", getValue: (r) => r.advance },

            {
              label: "Unit Number",
              getValue: (r) => r.Unit?.unitNumber ?? "N/A",
            },
            { label: "Floor", getValue: (r) => r.Floor?.floorNumber ?? "N/A" },

            {
              label: "Additional Notes",
              getValue: (r) => r.additionalNotes ?? "",
            },

            { label: "Lease Start Date", getValue: (r) => r.leaseStartDate },
            { label: "Lease End Date", getValue: (r) => r.leaseEndDate },
            { label: "Contract End Date", getValue: (r) => r.contractEndDate },
          ]}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mt-12">
          <div className="bg-base-100 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl mb-4">Edit Tenant</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) =>
                  setEditData({ ...editData, fullName: e.target.value })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={editData.phoneNumber}
                onChange={(e) =>
                  setEditData({ ...editData, phoneNumber: e.target.value })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                National ID
              </label>
              <input
                type="text"
                value={editData.nationalId}
                onChange={(e) =>
                  setEditData({ ...editData, nationalId: e.target.value })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Lease Start Date
              </label>
              <SmartDateInput
                value={editData.leaseStartDate}
                onChange={(gcDate) =>
                  setEditData({ ...editData, leaseStartDate: gcDate })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Lease End Date
              </label>
              <SmartDateInput
                value={editData.leaseEndDate}
                onChange={(date) => {
                  const updated = { ...editData, leaseEndDate: date };
                  setEditData(updated);
                  setErrors(validateEditData(updated));
                }}
              />

              {errors.leaseEndDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.leaseEndDate}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Contract End Date
              </label>
              <SmartDateInput
                value={editData.contractEndDate}
                onChange={(date) => {
                  const updated = { ...editData, contractEndDate: date };
                  setEditData(updated);
                  setErrors(validateEditData(updated));
                }}
              />

              {errors.contractEndDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contractEndDate}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Rent Amount
              </label>
              <input
                type="text"
                value={editData.amount}
                onChange={(e) =>
                  setEditData({ ...editData, amount: e.target.value })
                }
                readOnly
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Advance Payment
              </label>
              <input
                type="text"
                value={editData.advance}
                onChange={(e) =>
                  setEditData({ ...editData, advance: e.target.value })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Payment Status
              </label>
              <select
                value={editData.paymentStatus}
                onChange={(e) =>
                  setEditData({ ...editData, paymentStatus: e.target.value })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                <option value="paid">Paid</option>
                <option value="due">Due</option>
                <option value="overDue">Over Due</option>
              </select>
            </div> */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Additional Notes
              </label>
              <input
                type="text"
                value={editData.additionalNotes}
                onChange={(e) =>
                  setEditData({ ...editData, additionalNotes: e.target.value })
                }
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
              {editData.additionalNotes &&
                editData.additionalNotes.length < 10 && (
                  <div className="text-red-500 text-xs mt-2">
                    Notes must be at least 10 characters long.
                  </div>
                )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Floor</label>
              <select
                value={editData.floorId}
                onChange={(e) => {
                  setEditData({ ...editData, floorId: e.target.value });
                  fetchFreeUnits(e.target.value); // Fetch units when floor changes
                }}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              >
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.floorNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Unit{" "}
                {editData.status === "active" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <select
                value={editData.unitId || ""}
                onChange={async (e) => {
                  const selectedUnitId = e.target.value;

                  // Update selected unit
                  setEditData((prev) => ({ ...prev, unitId: selectedUnitId }));

                  if (selectedUnitId) {
                    try {
                      // Fetch unit details for rent
                      const response = await api.get(`unit/${selectedUnitId}`);
                      const rent = response.data?.taxedRentAmount || "";

                      // Auto-fill rent in editData
                      setEditData((prev) => ({ ...prev, amount: rent }));
                    } catch (err) {
                      console.error("Failed to fetch unit details:", err);
                    }
                  } else {
                    // Clear rent if no unit selected
                    setEditData((prev) => ({ ...prev, amount: "" }));
                  }
                }}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                disabled={isSaving || editData.status === "inactive"}
                required={editData.status === "active"}
              >
                <option value="">Select a unit</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unitNumber} {unit.status ? `(${unit.status})` : ""}
                  </option>
                ))}
              </select>

              {editData.status === "inactive" && editData.unitId && (
                <p className="text-sm text-gray-500 mt-1">
                  Current unit will be marked as available when saved.
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">TIN</label>
              <input
                type="text"
                value={editData.tin || ""}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  if (digits.length > 10) return;

                  const updated = { ...editData, tin: digits };
                  setEditData(updated);
                  setErrors(validateEditData(updated));
                }}
                className={`border p-2 rounded w-full ${
                  errors.tin ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors.tin && (
                <p className="text-red-500 text-sm mt-1">{errors.tin}</p>
              )}
            </div>
            {/* Status select */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={editData.status || "active"}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setEditData((prev) => ({
                    ...prev,
                    status: newStatus,
                    // If status is being set to inactive, clear the unit
                    ...(newStatus === "inactive" && { unitId: "" }),
                  }));
                }}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
                disabled={isSaving}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {editData.status === "inactive" && editData.unitId && (
                <p className="text-yellow-600 text-sm mt-1">
                  Note: Setting status to inactive will remove the tenant from
                  the current unit.
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Document</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="bg-base-100 w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4 flex items-center space-x-2">
              <input
                type="checkbox"
                id="resetPassword"
                checked={editData.resetPassword || false}
                onChange={(e) =>
                  setEditData({ ...editData, resetPassword: e.target.checked })
                }
                className="h-4 w-4"
              />
              <label htmlFor="resetPassword" className="text-sm font-medium">
                Reset password and send SMS
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={Object.keys(errors).length > 0}
                className={`px-4 py-2 rounded ${
                  Object.keys(errors).length > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-98">
            <h2 className="text-xl mb-4">Delete Tenant</h2>
            <p>Are you sure you want to delete this tenant?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Details Modal */}
      {isDetailsModalOpen && selectedTenant && (
        <div
          isOpen={isDetailsModalOpen}
          onRequestClose={() => setIsDetailsModalOpen(false)}
          contentLabel="Tenant Details"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mt-12"
        >
          <div className="bg-base-100 p-6 rounded-lg min-w-[72vh] max-h-[90vh] overflow-y-auto mt-10 ml-6">
            <h2 className="text-xl mb-4">Tenant Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <p className="text-sm">{selectedTenant.fullName}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <p className="text-sm">{selectedTenant.phoneNumber}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email </label>
              <p className="text-sm">{selectedTenant.email}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                National ID
              </label>
              <p className="text-sm">{selectedTenant.nationalId}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tin No</label>
              <p className="text-sm">{selectedTenant.tin}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Lease Start Date
              </label>
              <p className="text-sm">
                {selectedTenant.leaseStartDate
                  ? formatDateForDisplay(
                      normalizeDate(selectedTenant.leaseStartDate),
                    )
                  : "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Lease End Date
              </label>
              <p className="text-sm">
                {selectedTenant.leaseEndDate
                  ? formatDateForDisplay(
                      normalizeDate(selectedTenant.leaseEndDate),
                    )
                  : "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Contract End Date
              </label>
              <p className="text-sm">
                {selectedTenant.contractEndDate
                  ? formatDateForDisplay(
                      normalizeDate(selectedTenant.contractEndDate),
                    )
                  : "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Rent Amount
              </label>
              <p className="text-sm">{selectedTenant.amount || "N/A"}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Advance</label>
              <p className="text-sm">{selectedTenant.advance || "N/A"}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Aditional Note
              </label>
              <p className="text-sm">
                {selectedTenant.additionalNotes || "N/A"}
              </p>
            </div>

            {/* Car details section */}
            {selectedTenant.TenantVehicles &&
              selectedTenant.TenantVehicles.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Car Details
                  </label>
                  <div className="text-sm">
                    {selectedTenant.TenantVehicles.map((vehicle, index) => (
                      <div key={index} className="mb-2">
                        <p>
                          <strong>Car Name:</strong> {vehicle.carName}
                        </p>
                        <p>
                          <strong>Car Plate:</strong> {vehicle.carPlate}
                        </p>
                        {/* <p>
                          <strong>Color:</strong> {vehicle.color}
                        </p> */}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Unit Number
              </label>
              <p className="text-sm">
                {selectedTenant.Unit ? selectedTenant.Unit.unitNumber : "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Floor Number
              </label>
              <p className="text-sm">
                {selectedTenant.Floor
                  ? selectedTenant.Floor.floorNumber
                  : "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <p className="text-sm">{selectedTenant.status}</p>
            </div>
            {selectedTenant.document && (
              <div className="mb-4">
                <p>
                  <strong>Document:</strong>
                </p>
                {(() => {
                  const baseUrl = `${process.env.REACT_APP_BASE}`;

                  // Case 1: If document is a File object (after upload, before refresh)
                  if (selectedTenant.document instanceof File) {
                    const fileName = selectedTenant.document.name.toLowerCase();
                    if (
                      fileName.endsWith(".jpg") ||
                      fileName.endsWith(".jpeg") ||
                      fileName.endsWith(".png")
                    ) {
                      return (
                        <div>
                          <img
                            src={URL.createObjectURL(selectedTenant.document)}
                            alt="Tenant Document Preview"
                            className="w-full h-auto max-h-64 object-contain"
                            onError={(e) =>
                              (e.target.src = "/path/to/fallback-image.jpg")
                            }
                          />
                          <p className="text-sm text-gray-500">
                            Preview (refresh to view uploaded file)
                          </p>
                        </div>
                      );
                    } else {
                      return <p>{fileName} (Uploaded, refresh to view)</p>;
                    }
                  }

                  // Case 2: If document is a string (URL from server)
                  const fullDocumentUrl = `${baseUrl}${
                    selectedTenant.document.startsWith("/") ? "" : "/"
                  }${selectedTenant.document}`;
                  if (
                    fullDocumentUrl.endsWith(".pdf") ||
                    fullDocumentUrl.endsWith(".doc") ||
                    fullDocumentUrl.endsWith(".docx")
                  ) {
                    return (
                      <a
                        href={fullDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Document
                      </a>
                    );
                  } else if (
                    fullDocumentUrl.endsWith(".jpg") ||
                    fullDocumentUrl.endsWith(".jpeg") ||
                    fullDocumentUrl.endsWith(".png")
                  ) {
                    return (
                      <div>
                        <img
                          src={fullDocumentUrl}
                          alt="Tenant Document"
                          className="w-full h-auto max-h-64 object-contain"
                          onError={(e) =>
                            (e.target.src = "/path/to/fallback-image.jpg")
                          }
                        />
                      </div>
                    );
                  } else {
                    return (
                      <a
                        href={fullDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Document
                      </a>
                    );
                  }
                })()}
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isUnitModalOpen && unitDetails && (
        <div
          isOpen={isUnitModalOpen}
          onRequestClose={() => setIsUnitModalOpen(false)}
          contentLabel="Unit Details"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 mt-12"
        >
          <div className="bg-base-100 p-6 rounded-lg min-w-[72vh] max-h-[90vh] overflow-y-auto mt-10 ml-6">
            <h2 className="text-xl mb-4">Unit Details</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Unit Number
              </label>
              <p className="text-sm">
                {unitDetails.Unit ? unitDetails.Unit.unitNumber : "N/A"}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Size</label>
              <p className="text-sm">{unitDetails.Unit.size} sq ft</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Status</label>
              <p className="text-sm">{unitDetails.Unit.status}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Available Equipments
              </label>
              <p className="text-sm">
                {unitDetails.Unit.availableEquipments
                  ? JSON.parse(unitDetails.Unit.availableEquipments).join(", ")
                  : "not specified"}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Problems</label>
              <p className="text-sm">
                {unitDetails.Unit.problems
                  ? JSON.parse(unitDetails.Unit.problems).join(", ")
                  : "not specified"}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Rented Date
              </label>
              <p className="text-sm">
                {unitDetails.Unit.rentedDate
                  ? formatDateForDisplay(
                      normalizeDate(unitDetails.Unit.rentedDate),
                    )
                  : "N/A"}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsUnitModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for success/error messages */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        messageType={modal.messageType}
        message={modal.message}
      />
    </div>
  );
};

export default TenantList;
