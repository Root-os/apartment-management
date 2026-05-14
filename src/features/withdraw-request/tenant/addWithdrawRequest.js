import React, { useState, useEffect } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import Modal from "../../../components/Modal";
import SmartDateInput from "../../../components/Common/smartDatePicker";
import api from "../../../utils/api";

const WithdrawalRequestForm = () => {
  const [units, setUnits] = useState([]);
  // const [selectedUnitId, setSelectedUnitId] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [terminationDate, setTerminationDate] = useState("");
  const [reason, setReason] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`dashboard/for-tenant`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnits(response.data.unitsOccupied || []);

        const fetchedUnits = response.data.unitsOccupied || [];
        setUnits(fetchedUnits);

        if (fetchedUnits.length === 1) {
          setSelectedTenantId(fetchedUnits[0].tenantId);
        }
      } catch (err) {
        console.error("Error fetching units:", err);
      }
    };
    fetchUnits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTenantId) return alert("Please select a unit.");

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("tenantId", selectedTenantId);
      formData.append("terminationDate", terminationDate);
      formData.append("reason", reason);

      if (attachment) {
        formData.append("attachment", attachment);
      }
      const response = await api.post(`/withdrawal-request/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);
      setMessageType("success");
      setModalOpen(true);
      setTerminationDate("");
      setReason("");
      setAttachment(null);
    } catch (err) {
      console.error(err);
      // const message = err.response?.data?.message || 'Failed to submit withdrawal request.';

      setMessage(
        err.response?.data?.message || "Failed to submit withdrawal request.",
      );
      setMessageType("error");
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Send Withdrawal Request" topMargin="mt-2">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Select Unit
            </label>

            {units.length === 1 ? (
              <input
                type="text"
                value={`Unit ${units[0].unitNumber} (Floor ${units[0].floorNumber})`}
                readOnly
                className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
              />
            ) : (
              <select
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                required
                className="w-full border rounded-lg p-2 bg-base-100"
              >
                <option value="">-- Select a unit --</option>
                {units.map((u) => (
                  <option key={u.tenantId} value={u.tenantId}>
                    Unit {u.unitNumber} (Floor {u.floorNumber})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Termination Date */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Termination Date
            </label>
            <SmartDateInput
              value={terminationDate}
              onChange={(date) => setTerminationDate(date)}
              className="bg-base-100 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Reason */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="4"
              className="bg-base-100 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Attachment (optional)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png,.doc,.docx"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="w-full border rounded-lg p-2 bg-base-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-6 py-2 text-white font-semibold rounded-lg ${isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"}`}
          >
            {isLoading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </TitleCard>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </>
  );
};

export default WithdrawalRequestForm;
