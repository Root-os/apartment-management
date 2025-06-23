import React, { useEffect, useState } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import Modal from "../../components/Modal";
import LoadingComponent from "../../components/loading";

const token = localStorage.getItem("token");

const ViewSentSMS = () => {
  const [smsList, setSmsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSms, setSelectedSms] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessageType, setModalMessageType] = useState("success");

  useEffect(() => {
    const fetchSMS = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}sms`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSmsList(response.data.data || []);
      } catch (error) {
        setModalMessageType("error");
        setModalMessage("Failed to fetch SMS records.");
      } finally {
        setLoading(false);
      }
    };

    fetchSMS();
  }, []);

  const handleDelete = async () => {
    if (!selectedSms) return;
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}sms/${selectedSms.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSmsList(smsList.filter((sms) => sms.id !== selectedSms.id));
      setModalMessageType("success");
      setModalMessage("Message deleted successfully");
    } catch (error) {
      setModalMessageType("error");
      setModalMessage("Failed to delete SMS.");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedSms(null);
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "receiverName",
      label: "Receiver Name",
      render: (sms) => {
        if (sms.referenceType === "Tenant" && sms.tenant) {
          return sms.tenant.fullName;
        } else if (sms.referenceType === "User" && sms.user) {
          return `${sms.user.fname} ${sms.user.lname}`;
        } else {
          return "N/A";
        }
      },
    },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "referenceType", label: "Receiver Type" },
    { key: "message", label: "Message" },
    {
      key: "status",
      label: "Status",
      render: (sms) =>
        sms.type === "bulk" ? (
          <span
            className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold hover:bg-green-200 transition-colors cursor-pointer"
            title="Bulk SMS"
          >
            sent bulk
          </span>
        ) : (
          <span
            className={
              sms.status === "sent"
                ? "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold hover:bg-green-200 transition-colors cursor-pointer"
                : sms.status === "pending"
                ? "bg-green-100 text-blue-500 px-2 py-1 rounded font-semibold hover:bg-blue-200 transition-colors cursor-pointer"
                : "text-red-600"
            }
            title={sms.type === "single" ? "Single SMS" : sms.status}
          >
            {sms.status}
          </span>
        ),
    },
    {
      key: "createdAt",
      label: "Date Sent",
      render: (sms) => new Date(sms.createdAt).toLocaleString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (sms) => (
        <button
          onClick={() => {
            setSelectedSms(sms);
            setIsDeleteModalOpen(true);
          }}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Delete
        </button>
      ),
    },
  ];
  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <TableComponent
          title="SMS Log"
          data={smsList}
          columns={columns}
          rowsPerPageOptions={[5, 10, 20]}
          showSearch={true}
          exportable={true}
        />
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        messageType="warning"
        message="Are you sure you want to delete this SMS?"
        actions={[
          {
            label: "Cancel",
            onClick: () => setIsDeleteModalOpen(false),
            className: "bg-gray-400 text-white px-4 py-2 rounded",
          },
          {
            label: "Delete",
            onClick: handleDelete,
            className: "bg-red-500 text-white px-4 py-2 rounded",
          },
        ]}
      />

      {/* Status Modal */}
      <Modal
        isOpen={modalMessage !== ""}
        onClose={() => setModalMessage("")}
        messageType={modalMessageType}
        message={modalMessage}
        actions={[
          {
            label: "Close",
            onClick: () => setModalMessage(""),
            className: "bg-blue-500 text-white px-4 py-2 rounded",
          },
        ]}
      />
    </div>
  );
};

export default ViewSentSMS;
