import React, { useEffect, useState } from "react";
import TableComponent from "../../components/table";
import Modal from "../../components/Modal";
import LoadingComponent from "../../components/loading";
import api from "../../utils/api";

const PunishmentManagement = () => {
  const [punishments, setPunishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [selectedPunishment, setSelectedPunishment] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionStatus, setResolutionStatus] = useState("");
  const [resolveNegotiatedAmount, setResolveNegotiatedAmount] = useState("");
  const [statusFilter, setStatusFilter] = useState("unpaid");
const [tenantFilter, setTenantFilter] = useState("");

  const [formData, setFormData] = useState({
    tenantId: "",
    amount: "",
    negotiatedAmount: "",
    description: "",
    status: "unpaid",
  });

  // Fetch punishments
useEffect(() => {
  fetchPunishments(statusFilter, tenantFilter);
}, []);

 const fetchPunishments = (status = "", tenantId = "") => {
  const params = new URLSearchParams();

  if (status) params.append("status", status);
  if (tenantId) params.append("tenantId", tenantId);

  api
    .get(`punishments?${params.toString()}`)
    .then((response) => {
      setPunishments(response.data);
    })
    .catch((error) => {
      console.error("Error fetching punishments:", error);
    })
    .finally(() => {
      setLoading(false);
    });
};

useEffect(() => {
  fetchPunishments(statusFilter, tenantFilter);
}, [statusFilter, tenantFilter]);

  // Edit
  const handleEditClick = (punishment) => {
    setSelectedPunishment(punishment);

    setFormData({
      tenantId: punishment.tenantId,
      amount: punishment.amount,
      negotiatedAmount: punishment.negotiatedAmount || "",
      description: punishment.description || "",
      status: punishment.status,
    });

    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    setButtonLoading(true);

    api
      .put(`punishments/${selectedPunishment.id}`, formData)
      .then((response) => {
        setPunishments((prev) =>
          prev.map((item) =>
            item.id === selectedPunishment.id
              ? {
                  ...item,
                  ...response.data.punishment,
                }
              : item,
          ),
        );

        setIsEditModalOpen(false);

        setModalOpen(true);
        setMessageType("success");
        setMessage("Punishment updated successfully");
      })
      .catch((error) => {
        console.error(error);

        setModalOpen(true);
        setMessageType("error");
        setMessage(
          error.response?.data?.message || "Failed to update punishment",
        );
      })
      .finally(() => {
        setButtonLoading(false);
      });
  };

  // Delete
  const handleDeleteClick = (punishment) => {
    setSelectedPunishment(punishment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setButtonLoading(true);

    api
      .delete(`punishments/${selectedPunishment.id}`)
      .then(() => {
        setPunishments((prev) =>
          prev.filter((item) => item.id !== selectedPunishment.id),
        );

        setIsDeleteModalOpen(false);

        setModalOpen(true);
        setMessageType("success");
        setMessage("Punishment deleted successfully");
      })
      .catch((error) => {
        console.error(error);

        setModalOpen(true);
        setMessageType("error");
        setMessage("Unable to delete punishment");
      })
      .finally(() => {
        setButtonLoading(false);
      });
  };

  // Detail
  const handleDetailClick = (punishment) => {
    setSelectedPunishment(punishment);
    setIsDetailModalOpen(true);
  };

  const handleResolveClick = (punishment) => {
    setSelectedPunishment(punishment);

    setResolutionStatus("");

    setResolveNegotiatedAmount(punishment.negotiatedAmount || "");

    setIsResolveModalOpen(true);
  };

  const handleResolveSubmit = async () => {
    try {
      setButtonLoading(true);

      const payload = {
        ...selectedPunishment,

        status: resolutionStatus,

        negotiatedAmount:
          resolutionStatus === "negotiated"
            ? Number(resolveNegotiatedAmount)
            : null,
      };

      const response = await api.put(
        `punishments/${selectedPunishment.id}`,
        payload,
      );

      setPunishments((prev) =>
        prev.map((item) =>
          item.id === selectedPunishment.id
            ? {
                ...item,
                ...response.data.punishment,
              }
            : item,
        ),
      );

      setIsResolveModalOpen(false);

      setModalOpen(true);
      setMessageType("success");
      setMessage("Punishment resolved successfully");
    } catch (error) {
      console.error(error);

      setModalOpen(true);
      setMessageType("error");
      setMessage(
        error.response?.data?.message || "Failed to resolve punishment",
      );
    } finally {
      setButtonLoading(false);
    }
  };

  const columns = [
    {
      key: "tenant",
      label: "Tenant",
      render: (item) => item?.Tenant?.fullName || "N/A",
    },
    {
      key: "amount",
      label: "Amount",
      render: (item) => `${item.amount} ETB`,
    },
    {
      key: "negotiatedAmount",
      label: "Negotiated",
      render: (item) =>
        item.negotiatedAmount ? `${item.negotiatedAmount} ETB` : "-",
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-white text-sm
            ${
              item.status === "paid"
                ? "bg-green-500"
                : item.status === "unpaid"
                  ? "bg-red-500"
                  : item.status === "cleared"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
            }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <>
          <button
            onClick={() => handleResolveClick(item)}
            disabled={item.status !== "unpaid"}
            className={`py-1 px-2 rounded mr-2 text-white
            ${
              item.status !== "unpaid"
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Resolve
          </button>
          <button
            onClick={() => handleEditClick(item)}
            className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
          >
            Edit
          </button>

          <button
            onClick={() => handleDeleteClick(item)}
            className="bg-red-500 text-white py-1 px-2 rounded mr-2"
          >
            Delete
          </button>

          <button
            onClick={() => handleDetailClick(item)}
            className="bg-gray-500 text-white py-1 px-2 rounded"
          >
            Detail
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
         <div className="flex gap-4 mb-4">

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded bg-base-100"
          >
            <option value="unpaid">select status</option>
            <option value="paid">Paid</option>
            <option value="cleared">Cleared</option>
            <option value="negotiated">Negotiated</option>
            <option value="">All</option>
          </select>

          {/* <input
            type="number"
            placeholder="Tenant ID"
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            className="p-2 border rounded bg-base-100"
          /> */}

          <button
            onClick={() => {
              setStatusFilter("unpaid");
              setTenantFilter("");
            }}
            className="bg-gray-500 text-white px-3 rounded"
          >
            Reset
          </button>

        </div>

        <TableComponent
          title="Punishment List"
          data={punishments}
          columns={columns}
          showSearch={true}
        />
      </>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Edit Punishment</h2>

            <div className="mb-4">
              <label className="block mb-2">Amount</label>

              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value,
                  })
                }
                className="w-full p-2 border rounded bg-base-100"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Negotiated Amount</label>

              <input
                type="number"
                value={formData.negotiatedAmount}
                disabled={formData.status !== "negotiated"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    negotiatedAmount: e.target.value,
                  })
                }
                className={`w-full p-2 border rounded bg-base-100 ${
                  formData.status !== "negotiated"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                placeholder={
                  formData.status === "negotiated"
                    ? "Enter negotiated amount"
                    : "Only available for negotiated status"
                }
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Description</label>

              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border rounded bg-base-100"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Status</label>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="w-full p-2 border rounded bg-base-100"
              >
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="cleared">Cleared</option>
                <option value="negotiated">Negotiated</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleEditSubmit}
                disabled={buttonLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {buttonLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">
              Are you sure you want to delete this punishment?
            </h2>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                disabled={buttonLoading}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {buttonLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedPunishment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-[500px]">
            <h2 className="text-2xl font-bold mb-4">Punishment Detail</h2>

            <div className="space-y-3">
              <p>
                <strong>Tenant:</strong> {selectedPunishment?.Tenant?.fullName}
              </p>

              <p>
                <strong>Amount:</strong> {selectedPunishment.amount} ETB
              </p>

              <p>
                <strong>Negotiated Amount:</strong>{" "}
                {selectedPunishment.negotiatedAmount || "-"} ETB
              </p>

              <p>
                <strong>Status:</strong> {selectedPunishment.status}
              </p>

              <p>
                <strong>Description:</strong> {selectedPunishment.description}
              </p>

              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedPunishment.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isResolveModalOpen && selectedPunishment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-[450px]">
            <h2 className="text-2xl font-bold mb-4">Resolve Punishment</h2>

            <div className="space-y-3">
              <div>
                <strong>Tenant:</strong> {selectedPunishment?.Tenant?.fullName}
              </div>

              <div>
                <strong>Amount:</strong> {selectedPunishment.amount} ETB
              </div>

              <div>
                <strong>Description:</strong>{" "}
                {selectedPunishment.description || "-"}
              </div>

              <div className="pt-3">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="resolutionStatus"
                    value="paid"
                    checked={resolutionStatus === "paid"}
                    onChange={(e) => setResolutionStatus(e.target.value)}
                  />
                  Pay Punishment
                </label>

                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="resolutionStatus"
                    value="cleared"
                    checked={resolutionStatus === "cleared"}
                    onChange={(e) => setResolutionStatus(e.target.value)}
                  />
                  Clear Punishment
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="resolutionStatus"
                    value="negotiated"
                    checked={resolutionStatus === "negotiated"}
                    onChange={(e) => setResolutionStatus(e.target.value)}
                  />
                  Negotiate
                </label>
              </div>

              {resolutionStatus === "negotiated" && (
                <div className="mt-4">
                  <label className="block mb-2">Negotiated Amount</label>

                  <input
                    type="number"
                    value={resolveNegotiatedAmount}
                    onChange={(e) => setResolveNegotiatedAmount(e.target.value)}
                    className="w-full p-2 border rounded bg-base-100"
                    placeholder="Enter negotiated amount"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleResolveSubmit}
                disabled={buttonLoading || !resolutionStatus}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {buttonLoading ? "Saving..." : "Resolve"}
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

export default PunishmentManagement;
