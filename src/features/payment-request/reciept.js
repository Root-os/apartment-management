import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import LoadingComponent from "../../components/loading";

const PaymentReceiptPage = () => {
  const { paymentRequestId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetchReceipt();
  }, [paymentRequestId]);

  const fetchReceipt = async () => {
    try {
      const response = await api.get(
        `payment-response/request/${paymentRequestId}`,
      );

      if (response.data.success && response.data.data.length > 0) {
        setReceipt(response.data.data[0]);
      }
    } catch (error) {
      console.error("Failed to load receipt", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingComponent />;

  if (!receipt) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 text-lg">
          No receipt found for this payment.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const metadata = receipt.metadata ? JSON.parse(receipt.metadata) : {};

  return (
    <div className="max-w-3xl mx-auto p-6 print:p-0">
      <div className="border rounded-lg shadow-lg p-6 bg-white print:shadow-none">
        {/* Header */}
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold">Payment Receipt</h1>
          <p className="text-sm text-gray-500">
            {/* Receipt ID: #{receipt.id} */}
          </p>
        </div>

        {/* Status */}
        <div className="mb-6 text-center">
          <span
            className={`px-4 py-1 rounded text-sm font-semibold ${
              receipt.status === "approved"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {receipt.status.toUpperCase()}
          </span>
        </div>

        {/* Receipt Details */}
        <div className="text-sm divide-y">
          <div className="flex py-2">
            <div className="w-1/3 text-gray-500 font-medium">
              Payment Method
            </div>
            <div className="w-2/3 text-right">
              {receipt?.PaymentSetting?.paymentMethod}
            </div>
          </div>

          <div className="flex py-2">
            <div className="w-1/3 text-gray-500 font-medium">Amount</div>
            <div className="w-2/3 text-right font-bold text-green-700">
              ETB {receipt.amount}
            </div>
          </div>

          <div className="flex py-2">
            <div className="w-1/3 text-gray-500 font-medium">
              Transaction Number
            </div>
            <div className="w-2/3 text-right break-all">
              {receipt.transactionNumber}
            </div>
          </div>

          <div className="flex py-2">
            <div className="w-1/3 text-gray-500 font-medium">Reference No</div>
            <div className="w-2/3 text-right">
              {metadata.referenceNo || "-"}
            </div>
          </div>

          <div className="flex py-2">
            <div className="w-1/3 text-gray-500 font-medium">Receiver Name</div>
            <div className="w-2/3 text-right">{receipt.receiverName}</div>
          </div>

          <div className="flex py-2">
            <div className="w-1/3 text-gray-500 font-medium">
              Receiver Account
            </div>
            <div className="w-2/3 text-right">{receipt.receiverAccount}</div>
          </div>

          <div className="flex py-2">
            <div className="w-1/3 text-gray-500 font-medium">Payment Date</div>
            <div className="w-2/3 text-right">
              {new Date(receipt.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t pt-4 flex justify-between print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Back
          </button>

          <div className="flex gap-2">
            {metadata.receiptUrl && (
              <button
                onClick={() =>
                  window.open(
                    metadata.receiptUrl,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                View Bank Receipt
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptPage;
