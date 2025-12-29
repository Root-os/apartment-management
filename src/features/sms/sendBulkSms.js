import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard"
import Modal from '../../components/Modal';

const BulkSmsSender = () => {
  const [tenants, setTenants] = useState([]);
  const [users, setUsers] = useState([]);

  const [showTenants, setShowTenants] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const [selectedTenants, setSelectedTenants] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAllTenants, setSelectAllTenants] = useState(false);
  const [selectAllUsers, setSelectAllUsers] = useState(false);


  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem("token");
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${baseUrl}tenant`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTenants(res.data))
      .catch((err) => console.error("Failed to load tenants", err));

    axios
      .get(`${baseUrl}auth/employee`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error("Failed to load users", err));
  }, [token, baseUrl]);

  useEffect(() => {
    setSelectAllTenants(
      selectedTenants.length === tenants.length && tenants.length > 0
    );
  }, [selectedTenants, tenants]);

  useEffect(() => {
    setSelectAllUsers(
      selectedUsers.length === users.length && users.length > 0
    );
  }, [selectedUsers, users]);

  const toggleSelectAll = (type, checked) => {
    if (type === "Tenant") {
      setSelectedTenants(checked ? tenants.map((t) => t.id) : []);
    } else {
      setSelectedUsers(checked ? users.map((u) => u.id) : []);
    }
  };

  const handleCheckboxChange = (type, id, checked) => {
    if (type === "Tenant") {
      setSelectedTenants((prev) =>
        checked ? [...prev, id] : prev.filter((tid) => tid !== id)
      );
    } else {
      setSelectedUsers((prev) =>
        checked ? [...prev, id] : prev.filter((uid) => uid !== id)
      );
    }
  };

  const handleSubmit = async () => {
    const references = [
      ...selectedTenants.map((id) => ({
        referenceType: "Tenant",
        referenceId: id,
      })),
      ...selectedUsers.map((id) => ({
        referenceType: "User",
        referenceId: id,
      })),
    ];

    if (!message.trim() || references.length === 0) {
      return setFeedback({
        type: "error",
        text: "Please select at least one recipient and enter a message.",
      });
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${baseUrl}sms/send-bulk-sms`,
        { references, msg: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalOpen(true);
      setMessageType('success');  
      setMessage('SMS sent successfully!');
      setSelectedTenants([]);
      setSelectedUsers([]);
    } catch (err) {
      // setFeedback({
      //   type: "error",
      //   text: err.response?.data?.msg || err.message || "Failed to send SMS.",
      // });
      setModalOpen(true);
      setMessageType('error');  
      setMessage('Failed to send SMS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Send Bulk SMS" topMargin="mt-1" >

      {feedback.text && (
        <div
          className={`mb-4 p-3 rounded ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="flex space-x-6 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showTenants}
            onChange={() => setShowTenants((prev) => !prev)}
            className="h-5 w-5"
          />
          <span className="font-medium">Tenants</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showUsers}
            onChange={() => setShowUsers((prev) => !prev)}
            className="h-5 w-5"
          />
          <span className="font-medium">Users</span>
        </label>
      </div>

      {showTenants && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Tenants</h2>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={selectAllTenants}
                onChange={(e) => toggleSelectAll("Tenant", e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm">Select All</span>
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-auto border rounded p-2">
            {tenants.map((t) => (
              <label key={t.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTenants.includes(t.id)}
                  onChange={(e) =>
                    handleCheckboxChange("Tenant", t.id, e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm">
                  {t.fullName || "Unnamed"} ({t.phoneNumber || "No phone"}) — Unit {t.Unit?.unitNumber ?? "N/A"}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {showUsers && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Users</h2>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={selectAllUsers}
                onChange={(e) => toggleSelectAll("User", e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm">Select All</span>
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-auto border rounded p-2">
            {users.map((u) => (
              <label key={u.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(u.id)}
                  onChange={(e) =>
                    handleCheckboxChange("User", u.id, e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm">
                  {u.fname} {u.lname} ({u.phone})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
      <label> Message</label>
      <textarea
        className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
        placeholder="Type your SMS message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Bulk SMS"}
      </button>
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

export default BulkSmsSender;
