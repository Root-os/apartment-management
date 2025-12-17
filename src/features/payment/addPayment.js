import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import Modal from "../../components/Modal";
import * as Yup from "yup";
import SmartDateInput from "../../components/Common/smartDatePicker";

const PaymentAdd = () => {
  const [vendorId, setVendorId] = useState("");
  const [itemId, setItemId] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [description, setDescription] = useState("");
  const [item, setItem] = useState("");

  const [vendors, setVendors] = useState([]);
  const [vendorPurchases, setVendorPurchases] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");

  const [payments, setPayments] = useState([]);
  const [lastPaid, setLastPaid] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [totalPaidForItem, setTotalPaidForItem] = useState(0);
  

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}vendors`)
      .then((res) => setVendors(res.data))
      .catch((err) => console.error("Error fetching vendors:", err));
  }, []);

  // When vendor changes, fetch purchases
  useEffect(() => {
    if (!vendorId) return;
    axios
      .get(`${process.env.REACT_APP_BASE_URL}payments`)
      .then((res) => {
        const vendorPayments = res.data.filter(
          (p) => p.vendorId === parseInt(vendorId)
        );
        setPayments(vendorPayments);

        // also filter purchases
        axios.get(`${process.env.REACT_APP_BASE_URL}purchases`).then((res) => {
          const purchasesForVendor = res.data.filter(
            (p) => p.vendorId === parseInt(vendorId)
          );
          setVendorPurchases(purchasesForVendor);
        });
      })
      .catch((err) => console.error("Error fetching vendor data:", err));
  }, [vendorId]);

  // When item changes, set itemName, description, and price
  useEffect(() => {
    if (!selectedPurchase || payments.length === 0) {
      setLastPaid(null);
      setRemaining(null);
      setTotalPaidForItem(0);
      return;
    }

    const relatedPayments = payments
      .filter((p) => p.purchaseId === selectedPurchase.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (relatedPayments.length > 0) {
      setLastPaid(relatedPayments[0].price);
      setRemaining(relatedPayments[0].leftMoney);
    } else {
      setLastPaid(null);
      setRemaining(selectedPurchase.totalPrice);
    }

    setItem(selectedPurchase.Item?.itemName || "");
    setDescription(selectedPurchase.description || "");
    setPrice("");

    const itemName = selectedPurchase.Item?.itemName;
    const total = payments
      .filter(
        (p) =>
          p.item === itemName &&
          p.purchaseId === selectedPurchase.id &&
          parseInt(p.vendorId) === parseInt(vendorId)
      )
      .reduce((sum, p) => sum + parseFloat(p.price), 0);

    setTotalPaidForItem(total);
  }, [selectedPurchase, payments, vendorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !vendorId ||
      !price ||
      !paymentMethod ||
      !status ||
      !paymentDate ||
      !selectedPurchase
    ) {
      setError("All fields are required");
      return;
    }

    const purchaseId = selectedPurchase.id;

    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}payments`, {
        vendorId,
        purchaseId,
        item: selectedPurchase.Item?.itemName,
        description,
        price: parseFloat(price),
        paymentMethod,
        status,
        paymentDate,
      });

      // Reset form
      setVendorId("");
      setSelectedPurchase(null);
      setItem("");
      setDescription("");
      setPrice("");
      setPaymentMethod("");
      setStatus("");
      setPaymentDate("");

      setModalOpen(true);
      setMessageType("success");
      setMessage("Payment added successfully.");
      window.location.href = "/app/view-payments";
    } catch (err) {
      const resMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      setModalOpen(true);
      setMessageType("error");
      setMessage(resMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Add Payment for Vendor" topMargin="mt-1">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="vendorId"
              className="block text-sm font-medium text-white-700"
            >
              Vendor
            </label>
            <select
              id="vendorId"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="" disabled>
                Select Vendor
              </option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.fname} {vendor.lname}
                </option>
              ))}
            </select>
          </div>

          {vendorPurchases.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white-700">
                Select Purchase
              </label>
              <div className="mt-2 space-y-2">
                {vendorPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={`purchase-${purchase.id}`}
                      checked={selectedPurchase?.id === purchase.id}
                      onChange={() =>
                        setSelectedPurchase((prev) =>
                          prev?.id === purchase.id ? null : purchase
                        )
                      }
                      className="checkbox"
                    />
                    <label
                      htmlFor={`purchase-${purchase.id}`}
                      className="text-sm"
                    >
                      {purchase.Item?.itemName} –{" "}
                      {new Date(purchase.date).toISOString().split("T")[0]}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPurchase && (
            <div className="mb-4 p-4 bg-base-200 rounded-lg text-sm">
              <p>
                <strong>Total Price:</strong> {selectedPurchase.totalPrice} ETB
              </p>
              <p>
                <strong>Total Paid:</strong>{" "}
                {totalPaidForItem.toFixed(2) ?? "0"} ETB
              </p>
              <p>
                <strong>Remaining:</strong>{" "}
                {remaining ?? selectedPurchase.totalPrice} ETB
              </p>
              {/* <p className="mt-2 text-yellow-300"><strong>Total Paid (Same Item & Vendor):</strong> {totalPaidForItem.toFixed(2)} ETB</p> */}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-white-700"
            >
              Price
            </label>
            
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onWheel= {(e)=>e.target.blur()}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              min={0}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-white-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-white-700"
            >
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="" disabled>
                Select Payment Method
              </option>
            <option value="">Select</option>
            <option value="cash">Cash</option>
            <option value="bank transfer">Bank Transfer</option>
            <option value="tellebirr">Tellebirr</option>
            <option value="mobile banking">Mobile Banking</option>
            <option value="others">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-white-700"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="complete">Complete</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="paymentDate"
              className="block text-sm font-medium text-white-700"
            >
              Payment Date
            </label>
            <SmartDateInput
              id="paymentDate"
              value={paymentDate}
              onChange={(date) => setPaymentDate(date)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-base-100"
              required
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 w-full"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
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

export default PaymentAdd;
