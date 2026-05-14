import React, { useEffect, useState } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import Modal from "../../components/Modal";
import Loading from "../../components/loading";
import api from "../../utils/api";

const TenantRentPage = () => {
  const [tenantInfo, setTenantInfo] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("error");
  const [message, setMessage] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
const [selectedRent, setSelectedRent] = useState(null);

  useEffect(() => {
    const tenantId = localStorage.getItem("userId");
    if (!tenantId) {
      setMessage("Tenant ID not found in localStorage");
      setMessageType("error");
      setModalOpen(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await api.get("rent-collection/my-rents");

        setPaymentHistory(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch rent payment data.");
        setMessageType("error");
        setModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      key: "floorNumber",
      label: "Floor",
      render: (row) => row.Tenant?.Floor?.floorNumber || "N/A",
    },
    {
      key: "unitNumber",
      label: "Unit",
      render: (row) => row.Tenant?.Unit?.unitNumber || "N/A",
    },
    {
      key: "paymentDate",
      label: "Paid From",
      isDate: true,
    },
    {
      key: "nextDueDate",
      label: "Paid To",
      isDate: true,
    },
    { key: "paidDays", label: "Paid Days" },
    {
      key: "amountPaid",
      label: "Amount Paid",
      render: (row) => `${Math.ceil(Number(row.amountPaid))} ETB`,
    },
    { key: "status", label: "Status" },
    {
  key: "paymentMethod",
  label: "Method",
  render: (row) =>
    row.PaymentSetting?.paymentMethod || "N/A",
},
    {
  key: "actions",
  label: "Actions",
  render: (row) => (
    <button
      onClick={() => {
        setSelectedRent(row);
        setDetailOpen(true);
      }}
      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
    >
      Details
    </button>
  ),
}
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {loading ? (
        <Loading />
      ) : (
        <>
          <TableComponent
            title="Rent Payment History"
            data={Array.isArray(paymentHistory) ? paymentHistory : []}
            columns={columns}
            showSearch={true}
            exportable={true}
          />

          {/* {paymentHistory.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No rent payment history available.
            </p>
          )} */}
        </>
      )}

{detailOpen && selectedRent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">

    <div className="bg-base-100 p-6 rounded-lg w-full max-w-2xl mx-4">

      <h2 className="text-xl mb-4">
        Details for {selectedRent.Tenant?.fullName || "N/A"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <p>
          <strong>Tenant Name:</strong>{" "}
          {selectedRent.Tenant?.fullName || "N/A"}
        </p>

        <p>
          <strong>Phone Number:</strong>{" "}
          {selectedRent.Tenant?.phoneNumber || "N/A"}
        </p>

        <p>
          <strong>Tenant Email:</strong>{" "}
          {selectedRent.Tenant?.email || "No Email"}
        </p>

        <p>
          <strong>Paid From:</strong>{" "}
          {new Date(selectedRent.paymentDate).toLocaleDateString()}
        </p>

        <p>
          <strong>Floor Number:</strong>{" "}
          {selectedRent.Tenant?.Floor?.floorNumber || "N/A"}
        </p>

        <p>
          <strong>Paid To:</strong>{" "}
          {new Date(selectedRent.nextDueDate).toLocaleDateString()}
        </p>

        <p>
          <strong>Unit Number:</strong>{" "}
          {selectedRent.Tenant?.Unit?.unitNumber || "N/A"}
        </p>

        <p>
          <strong>Paid Days:</strong>{" "}
          {selectedRent.paidDays}
        </p>

        <p>
          <strong>Next Due Date:</strong>{" "}
          {new Date(selectedRent.nextDueDate).toLocaleDateString()}
        </p>

        <p>
          <strong>Payment Status:</strong>{" "}
          {selectedRent.status}
        </p>

        <p>
          <strong>Payment Method:</strong>{" "}
          {selectedRent.PaymentSetting?.paymentMethod || "N/A"}
        </p>

        <p>
          <strong>Amount Paid:</strong>{" "}
          {selectedRent.amountPaid?.toLocaleString() || 0} ETB
        </p>

        <p>
          <strong>Extra Amount:</strong>{" "}
          {selectedRent.extraAmount?.toLocaleString() || 0} ETB
        </p>

        <p>
          <strong>Punishment:</strong>{" "}
          {selectedRent.punishment}
        </p>

        <p>
          <strong>Is Paid:</strong>{" "}
          {selectedRent.isPaid ? "Yes" : "No"}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          {selectedRent.description || "N/A"}
        </p>

        <p className="sm:col-span-2">
          <strong>Attachment:</strong>{" "}
          {selectedRent.attachment ? (
            <a
              href={selectedRent.attachment}
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
          onClick={() => setDetailOpen(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded"
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

export default TenantRentPage;
