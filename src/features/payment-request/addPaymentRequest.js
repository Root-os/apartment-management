import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from '../../components/Cards/TitleCard';
import Modal from '../../components/Modal';

const AddPaymentRequest = () => {
  const [formData, setFormData] = useState({
    tenantId: "",
    message: "",
    paymentTypeId: "",
    level: "high",
    amount: "",
    dueDate: "",
    repeatedFor: "monthly",
  });

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch payment types
    axios
      .get("https://apartment.houseethiopia.com/api/payment-types")
      .then((response) => setPaymentTypes(response.data))
      .catch((error) => console.error("Error fetching payment types:", error));

    // Fetch tenants
    axios
      .get("https://apartment.houseethiopia.com/api/tenant")
      .then((response) => setTenants(response.data))
      .catch((error) => console.error("Error fetching tenants:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const validationErrors = {};
    if (!formData.tenantId) validationErrors.tenantId = "Tenant is required";
    if (!formData.message) validationErrors.message = "Message is required";
    if (!formData.paymentTypeId)
      validationErrors.paymentTypeId = "Payment Type is required";
    if (!formData.amount || isNaN(formData.amount))
      validationErrors.amount = "Amount must be a valid number";
    if (!formData.dueDate) validationErrors.dueDate = "Due Date is required";
    if (!formData.level) validationErrors.level = "Level is required";
    if (!formData.repeatedFor)
      validationErrors.repeatedFor = "Repeated For is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Send POST request
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://apartment.houseethiopia.com/api/payment-requests",
        {
          tenantId: formData.tenantId,
          message: formData.message,
          paymentTypeId: formData.paymentTypeId,
          level: formData.level,
          amount: parseFloat(formData.amount),
          dueDate: formData.dueDate,
          repeatedFor: formData.repeatedFor, 
        },
       
      );
      // alert("Payment Request Created: " + response.data.message);
      setModalOpen(true);
      setMessageType('success');
      setMessage('payment request data added successfully');
      window.location.href='/app/payment-request-view';
    } catch (error) {
      console.error("Error creating payment request:", error);
      alert("Error creating payment request");
      setModalOpen(true);
      setMessageType('error');
      setMessage('Unable to add payment request data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TitleCard title={'ADD Payment Request'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tenant Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Tenant</label>
          <select
            name="tenantId"
            value={formData.tenantId}
            onChange={handleInputChange}
            className="w-full bg-base-100 p-2 border rounded-md"
          >
            <option value="">Select Tenant</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.fullName}
              </option>
            ))}
          </select>
          {errors.tenantId && <p className="text-red-500">{errors.tenantId}</p>}
        </div>
           {/* Payment Type Dropdown */}
           <div>
          <label className="block text-sm font-medium mb-1">Payment Type</label>
          <select
            name="paymentTypeId"
            value={formData.paymentTypeId}
            onChange={handleInputChange}
            className="w-full bg-base-100 p-2 border rounded-md"
          >
            <option value="">Select Payment Type</option>
            {paymentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.paymentTypeId && (
            <p className="text-red-500">{errors.paymentTypeId}</p>
          )}
        </div>
        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <input
            type="text"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full bg-base-100 p-2 border rounded-md"
            placeholder="Message"
          />
          {errors.message && <p className="text-red-500">{errors.message}</p>}
        </div>
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="w-full bg-base-100 p-2 border rounded-md"
            placeholder="Amount"
          />
          {errors.amount && <p className="text-red-500">{errors.amount}</p>}
        </div>
         {/* Level Dropdown */}
         <div>
          <label className="block text-sm font-medium mb-1">Level</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className="w-full bg-base-100 p-2 border rounded-md"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {errors.level && <p className="text-red-500">{errors.level}</p>}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            className="w-full bg-base-100 p-2 border rounded-md"
          />
          {errors.dueDate && <p className="text-red-500">{errors.dueDate}</p>}
        </div>

        {/* Repeated For Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Repeated For</label>
          <select
            name="repeatedFor"
            value={formData.repeatedFor}
            onChange={handleInputChange}
            className="w-full bg-base-100 p-2 border rounded-md"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
          {errors.repeatedFor && (
            <p className="text-red-500">{errors.repeatedFor}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full p-3 bg-blue-500 text-white rounded-md ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Payment Request"}
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

export default AddPaymentRequest;
