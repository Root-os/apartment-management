import React, { useEffect, useState } from "react";
import axios from "axios";
import TableComponent from "../../components/table";
import Modal from "../../components/Modal";
import Loading from "../../components/loading";

const TenantPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
   const tenantId = localStorage.getItem('userId');

    if (!tenantId) {
      setMessageType("error");
      setModalMessage("Tenant ID not found in localStorage.");
      setModalOpen(true);
      return;
    }

    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}tenant-payments/${tenantId}`)
      .then((response) => {
        setPayments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tenant payments:", error);
        setMessageType("error");
        setModalMessage("Failed to load payment history.");
        setModalOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const columns = [
    { key: "tenantName", label: "Tenant Name", render: (p) => p.Tenant?.fullName || "N/A" },
    { key: "billType", label: "Bill Type", render: (p) => p.BillType?.typeName || "N/A" },
    { key: "amountPaid", label: "Amount Paid", render: (p) => p.amountPaid },
    {
      key: "startDate",
      label: "Start Date",
      isDate: true
    },
    {
      key: "endDate",
      label: "End Date",
      isDate: true
    },
    // {
    //   key: "paymentDate",
    //   label: "Payment Date",
    //   render: (p) => p.paymentDate ? new Date(p.paymentDate).toISOString().split("T")[0] : "N/A",
    // },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-4">

      {isLoading ? (
        <Loading/>
      ) : (
        <TableComponent
          title="Payment Records"
          data={payments}
          columns={columns}
          rowsPerPageOptions={[5, 10]}
          showSearch={true}
          exportable={true}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={modalMessage}
      />
    </div>
  );
};

export default TenantPaymentHistory;
