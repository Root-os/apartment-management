import React, { useState, useEffect } from "react";
import TableComponent from "../../../components/table";
import LoadingComponent from "../../../components/loading";
import Modal from "../../../components/Modal";
import api from "../../../utils/api";

const ViewMyRequest = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [requestToFeedback, setRequestToFeedback] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");
  const [editAttachment, setEditAttachment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [requestToEdit, setRequestToEdit] = useState(null);
  const [editData, setEditData] = useState({
    tenantId: "",
    terminationDate: "",
    reason: "",
  });
  const [floorUnits, setFloorUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authorization token not found.");
        setLoading(false);
        return;
      }
      const response = await api.get(`withdrawal-request/tenant/my-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWithdrawalRequests(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch withdrawal requests.");
      setLoading(false);
    }
  };

  const fetchFloorUnits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token not found.");

      const response = await api.get("tenant/floor-units", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Flatten tenant data to map unitNumber -> tenantId
      const units = [];
      response.data.forEach((person) => {
        person.tenant.forEach((t) => {
          units.push({
            tenantId: t.tenantId,
            unitNumber: t.unit.unitNumber,
            tenantName: t.fullName,
          });
        });
      });

      setFloorUnits(units);
      setLoadingUnits(false);
    } catch (error) {
      console.error("Failed to fetch floor units:", error);
      setLoadingUnits(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchFloorUnits();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleFeedbackClick = (request) => {
    setRequestToFeedback(request);
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authorization token not found.");
        return;
      }

      const response = await api.put(
        `withdrawal-request/feedback`,
        {
          requestId: requestToFeedback.id,
          tenantFeedback: feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Check if feedback submission was successful
      if (response.data.message === "Tenant feedback submitted.") {
        // Update the request in the list after feedback submission
        setWithdrawalRequests((prevData) =>
          prevData.map((request) =>
            request.id === requestToFeedback.id
              ? response.data.request
              : request,
          ),
        );
        setIsFeedbackModalOpen(false);
        setRequestToFeedback(null);
        setFeedback("");
        setModalOpen(true);
        setMessageType("success");
        setMessage("Feedback added successfully");
      } else {
        // setError('Failed to submit feedback.');
        setModalOpen(true);
        setMessageType("error");
        setMessage("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // setError('Failed to submit feedback.');
      setModalOpen(true);
      setMessageType("error");
      setMessage("Failed to submit feedback, something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (request) => {
    setRequestToEdit(request);
    setEditData({
      tenantId: request.tenantId || "",
      terminationDate: request.terminationDate
        ? request.terminationDate.split("T")[0]
        : "",
      reason: request.reason || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      if (editData.tenantId) formData.append("tenantId", editData.tenantId);
      if (editData.terminationDate)
        formData.append("terminationDate", editData.terminationDate);
      if (editData.reason) formData.append("reason", editData.reason);
      if (editAttachment) formData.append("attachment", editAttachment);

      const response = await api.put(
        `withdrawal-request/update/${requestToEdit.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (
        response.data.message === "Withdrawal request updated successfully."
      ) {
        setWithdrawalRequests((prev) =>
          prev.map((req) =>
            req.id === requestToEdit.id ? response.data.request : req,
          ),
        );

        setModalOpen(true);
        setMessageType("success");
        setMessage("Updated successfully!");
        setIsEditModalOpen(false);
        setEditAttachment(null);
      }
    } catch (error) {
      setModalOpen(true);
      setMessageType("error");
      setMessage("Update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      label: "Unit Number",
      key: "unitNumber",
      render: (row) => row?.Tenant?.Unit?.unitNumber || "N/A",
    },
    { label: "Reason", key: "reason" },
    {
      key: "terminationDate",
      label: "Termination Date",
      isDate: true,
    },
    { label: "Status", key: "status" },
    { label: "Admin Response", key: "adminResponse" },
    { label: "Deposit Refund Status", key: "depositRefundStatus" },
    { label: "Tenant Feedback", key: "tenantFeedback" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex space-x-1">
          <button
            onClick={() => handleFeedbackClick(row)}
            className={`py-1 px-4 rounded ${
              row.tenantFeedback
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={!!row.tenantFeedback}
          >
            Feedback
          </button>
          <button
            onClick={() => handleEditClick(row)}
            className="py-1 px-4 rounded bg-green-500 text-white hover:bg-green-600"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setSelectedRequest(row);
              setIsDetailModalOpen(true);
            }}
            className="py-1 px-4 rounded bg-gray-600 text-white hover:bg-gray-700"
          >
            Detail
          </button>
        </div>
      ),
    },
  ];

  const handleAddClick = () => {
    window.location.href = "/app/withdraw-request-add";
  };

  const isImage = (url) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  };

  return (
    <div>
      <TableComponent
        title="Withdrawal Requests"
        data={withdrawalRequests}
        columns={columns}
        rowsPerPageOptions={[5, 10, 15]}
        showSearch={true}
        exportable={true}
        onAdd={handleAddClick}
      />

      {isFeedbackModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-300 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Submit Feedback</h2>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-1 bg-base-100 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              rows="4"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsFeedbackModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={isLoading}
              >
                {isLoading ? "submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-300 p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Edit Withdrawal Request</h2>

            <label className="block mb-2">Unit Number</label>
            {loadingUnits ? (
              <p>Loading units...</p>
            ) : (
              <select
                value={editData.tenantId}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, tenantId: e.target.value }))
                }
                className="w-full p-2 mb-3 border rounded"
              >
                <option value="">Select a unit</option>
                {floorUnits.map((unit) => (
                  <option key={unit.tenantId} value={unit.tenantId}>
                    {unit.unitNumber}
                  </option>
                ))}
              </select>
            )}
            <label className="block mb-2">Termination Date</label>
            <input
              type="date"
              value={editData.terminationDate}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  terminationDate: e.target.value,
                }))
              }
              className="w-full p-2 mb-3 border rounded"
            />

            <label className="block mb-2">Reason</label>
            <textarea
              value={editData.reason}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, reason: e.target.value }))
              }
              rows={3}
              className="w-full p-2 mb-3 border rounded"
            />
            <label className="block mb-2">Attachment</label>
            <input
              type="file"
              accept=".pdf,.jpg,.png,.jpeg"
              onChange={(e) => setEditAttachment(e.target.files[0])}
              className="w-full p-2 mb-3 border rounded"
            />

            {/* Show current file */}
            {requestToEdit?.attachment && (
              <a
                href={requestToEdit.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm underline"
              >
                View current attachment
              </a>
            )}

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-300 p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl mb-4">Request Details</h2>

            <p>
              <strong>Unit:</strong> {selectedRequest?.Tenant?.Unit?.unitNumber}
            </p>
            <p>
              <strong>Reason:</strong> {selectedRequest.reason}
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.status}
            </p>
            <p>
              <strong>Termination Date:</strong>{" "}
              {selectedRequest.terminationDate?.split("T")[0]}
            </p>
            <p>
              <strong>Admin Response:</strong>{" "}
              {selectedRequest.adminResponse || "N/A"}
            </p>

            {/* Attachment preview */}
            <div className="mt-4">
              <p className="font-semibold">Attachment:</p>

              {selectedRequest.attachment ? (
                isImage(selectedRequest.attachment) ? (
                  <img
                    src={selectedRequest.attachment}
                    alt="attachment"
                    className="mt-2 max-h-60 rounded border"
                  />
                ) : (
                  <iframe
                    src={selectedRequest.attachment}
                    title="PDF"
                    className="w-full h-64 mt-2 border"
                  />
                )
              ) : (
                <p>No attachment</p>
              )}

              {/* Download link */}
              {selectedRequest.attachment && (
                <a
                  href={selectedRequest.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-500 underline"
                >
                  Open / Download
                </a>
              )}
            </div>

            <div className="flex justify-end mt-4">
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  );
};

export default ViewMyRequest;
