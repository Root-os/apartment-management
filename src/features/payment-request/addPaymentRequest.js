import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import Modal from "../../components/Modal";
import SmartDateInput from "../../components/Common/smartDatePicker";
import api from "../../utils/api";

const AddPaymentRequest = () => {
  const [formData, setFormData] = useState({
    tenantId: "",
    message: "",
    billTypeId: "",
    level: "high",
    amount: "",
    dueDate: "",
    repeatedFor: "monthly",
    startDate: "",
    endDate: "",
    paidDays: "",
  });

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");

  const [profiles, setProfiles] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState("");
  const [tenantId, setTenantId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthsCount, setMonthsCount] = useState("");
  const [daysCount, setDaysCount] = useState("");
  const [paidDays, setPaidDays] = useState("");

  const [isRentType, setIsRentType] = useState(false);
  const [tenantRent, setTenantRent] = useState("");
  const [leaseStartDate, setLeaseStartDate] = useState("");
  const [leaseEndDate, setLeaseEndDate] = useState("");
  const [tenantPayments, setTenantPayments] = useState([]);

  useEffect(() => {
    api
      .get(`bill-type`)
      .then((response) => setPaymentTypes(response.data))
      .catch((error) => console.error("Error fetching payment types:", error));

    // Fetch tenants
    api
      .get(`tenant/floor-units`)
      .then((response) => setProfiles(response.data))
      .catch((error) => console.error("Error fetching tenants:", error));
  }, []);

  useEffect(() => {
    if (!formData.tenantId) return;
    if (isRentType) {
      setTenantPayments([]); // clear payments for rent
      return;
    }

    // Fetch tenant payments
    api
      .get(`tenant-payments?tenantId=${formData.tenantId}`)
      .then((response) => {
        const payments = response.data;

        // Keep only the latest payment for each bill type
        const latestPaymentsMap = {};
        payments.forEach((p) => {
          const billTypeId = p.billTypeId;
          if (
            !latestPaymentsMap[billTypeId] ||
            new Date(p.createdAt) >
              new Date(latestPaymentsMap[billTypeId].createdAt)
          ) {
            latestPaymentsMap[billTypeId] = p;
          }
        });

        setTenantPayments(Object.values(latestPaymentsMap));
      })
      .catch((err) => console.error("Error fetching tenant payments:", err));
  }, [formData.tenantId, isRentType]);

  useEffect(() => {
    if (startDate && (monthsCount || daysCount)) {
      let result = new Date(startDate);

      if (monthsCount) {
        result.setDate(result.getDate() + parseInt(monthsCount) * 30);
      }

      if (daysCount) {
        result.setDate(result.getDate() + parseInt(daysCount));
      }

      result.setDate(result.getDate() - 1);

      setEndDate(result.toISOString().split("T")[0]);
    }
  }, [startDate, monthsCount, daysCount]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const diffTime = end - start;

      const calendarDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

      setPaidDays(calendarDays);
    } else {
      setPaidDays("");
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (isRentType && tenantRent && paidDays) {
      const monthly = parseFloat(tenantRent);
      const days = parseInt(paidDays);
      if (!isNaN(monthly) && !isNaN(days)) {
        const calculatedAmount = ((monthly / 30) * days).toFixed(2);
        setFormData((prev) => ({ ...prev, amount: calculatedAmount }));
      }
    }
  }, [isRentType, tenantRent, paidDays]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleDateChange = (name) => (value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileChange = (e) => {
    const index = e.target.value;
    setSelectedProfileIndex(index);
    const selectedProfile = profiles[index];

    if (selectedProfile?.tenant.length === 1) {
      const tenant = selectedProfile.tenant[0];
      setTenantRent(tenant.amount || ""); // set tenantRent
      setFormData((prev) => ({ ...prev, tenantId: tenant.tenantId }));
    } else {
      setTenantRent("");
      setFormData((prev) => ({ ...prev, tenantId: "" }));
    }
  };

  const handleUnitChange = (e) => {
    const tenantId = e.target.value;
    const profile = profiles[selectedProfileIndex];

    const tenant = profile?.tenant?.find(
      (t) => t.tenantId.toString() === tenantId,
    );

    setTenantRent(tenant?.amount || "");
    setLeaseStartDate(tenant?.leaseStartDate || "");
    setLeaseEndDate(tenant?.leaseEndDate || "");

    // ✅ AUTO SET startDate like your other page
    let start = tenant?.leaseEndDate
      ? new Date(tenant.leaseEndDate)
      : new Date(tenant?.leaseStartDate);

    if (tenant?.leaseEndDate) {
      start.setDate(start.getDate() + 1);
    }

    setStartDate(start.toISOString().split("T")[0]);

    setFormData((prev) => ({ ...prev, tenantId }));
  };

  const handleBillTypeChange = (e) => {
    const value = e.target.value;

    const selectedType = paymentTypes.find(
      (type) => type.id.toString() === value,
    );

    const hasRentWord = selectedType?.typeName?.toLowerCase().includes("rent");

    setIsRentType(hasRentWord);

    // ✅ If rent selected AND tenant already chosen → trigger recalculation
    if (hasRentWord && formData.tenantId) {
      const profile = profiles[selectedProfileIndex];
      const tenant = profile?.tenant?.find(
        (t) => t.tenantId.toString() === formData.tenantId,
      );

      if (tenant) {
        setTenantRent(tenant.amount || "");
        setLeaseStartDate(tenant.leaseStartDate || "");
        setLeaseEndDate(tenant.leaseEndDate || "");

        let start = tenant.leaseEndDate
          ? new Date(tenant.leaseEndDate)
          : new Date(tenant.leaseStartDate);

        if (tenant.leaseEndDate) {
          start.setDate(start.getDate() + 1);
        }

        setStartDate(start.toISOString().split("T")[0]);
      }
    }

    setFormData((prev) => ({
      ...prev,
      billTypeId: value,
      amount: hasRentWord ? prev.amount : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const validationErrors = {};
    if (!formData.tenantId) validationErrors.tenantId = "Tenant is required";
    if (!formData.billTypeId)
      validationErrors.billTypeId = "Payment Type is required";
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

    // Prepare data to send in POST request
    const requestData = {
      tenantId: formData.tenantId,
      message: formData.message,
      billTypeId: formData.billTypeId,
      level: formData.level,
      amount: parseFloat(formData.amount), // Ensure amount is a number
      dueDate: formData.dueDate, // Ensure this is a valid date string
      repeatedFor: formData.repeatedFor,
      startDate,
      endDate,
      paidDays,
    };
    console.log("Final data being sent:", requestData);

    // Send POST request
    try {
      setIsLoading(true);
      const response = await api.post(
        `payment-requests`,
        requestData,
      );

      // Successfully created payment request
      setModalOpen(true);
      setMessageType("success");
      setMessage("Payment request created successfully");
      setTimeout(() => {
        window.location.href = "/app/payment-request-view"; // Redirect after success
      }, 1500);
    } catch (error) {
      // console.error("Error creating payment request:", error);
      // Check if error response contains useful information
      setModalOpen(true);
      setMessageType("error");
      setMessage(error.response.data.error || error.response.data.message || "Unable to add payment request");
      // if (error.response) {
      //   console.error("API Error:", error.response.data);
      //   setModalOpen(true);
      //   setMessageType('error');
      //   setMessage( error.response.data.message || 'Unable to add payment request');
      // } else {
      //   setModalOpen(true);
      //   setMessageType('error');
      //   setMessage('An unexpected error occurred.');
      // }
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (profiles.length === 0) return;

  //   profiles.forEach((profile, index) => {
  //     if (profile.tenant.length === 1 && !formData.tenantId) {
  //       setSelectedProfileIndex(index);
  //       setFormData((prev) => ({
  //         ...prev,
  //         tenantId: profile.tenant[0].tenantId,
  //       }));
  //     }
  //   });
  // }, [profiles]);

  useEffect(() => {
    if (!isRentType) return;
    if (!formData.tenantId) return;
    if (selectedProfileIndex === "") return;

    const profile = profiles[selectedProfileIndex];

    const tenant = profile?.tenant?.find(
      (t) => t.tenantId === Number(formData.tenantId),
    );

    console.log("SYNC TENANT:", tenant);

    if (!tenant) return;

    setTenantRent(tenant.amount || "");
    setLeaseStartDate(tenant.leaseStartDate || "");
    setLeaseEndDate(tenant.leaseEndDate || "");

    let start = tenant.leaseEndDate
      ? new Date(tenant.leaseEndDate)
      : new Date(tenant.leaseStartDate);

    if (tenant.leaseEndDate) {
      start.setDate(start.getDate() + 1);
    }

    setStartDate(start.toISOString().split("T")[0]);
  }, [isRentType, formData.tenantId, selectedProfileIndex, profiles]);

  return (
    <>
      {/* Request Tenant Payment */}
      <TitleCard title={"Request Tenant Paymentt"} topMargin={"mt-1"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tenant Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Tenant</label>
            <select
              value={selectedProfileIndex}
              onChange={handleProfileChange}
              className="w-full bg-base-100 p-2 border rounded-md"
            >
              <option value="">Select Tenant</option>
              {profiles.map((profile, index) => (
                <option key={profile.phoneNumber} value={index}>
                  {profile.fullName} ({profile.phoneNumber})
                </option>
              ))}
            </select>
          </div>

          {selectedProfileIndex !== "" &&
            profiles[selectedProfileIndex] &&
            Array.isArray(profiles[selectedProfileIndex].tenant) && (
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <select
                  value={formData.tenantId}
                  onChange={handleUnitChange}
                  className="w-full bg-base-100 p-2 border rounded-md"
                >
                  {profiles[selectedProfileIndex].tenant.length > 1 && (
                    <option value="">Select Unit</option>
                  )}
                  {profiles[selectedProfileIndex].tenant.map((t) => (
                    <option key={t.tenantId} value={t.tenantId}>
                      Unit {t.unit.unitNumber} – Floor {t.floor.floorNumber}
                    </option>
                  ))}
                </select>
              </div>
            )}
          {/* Payment Type Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Payment Type
            </label>
            <select
              name="billTypeId"
              value={formData.billTypeId}
              onChange={handleBillTypeChange}
              className="w-full bg-base-100 p-2 border rounded-md"
            >
              <option value="">Select Payment Type</option>
              {paymentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.typeName}
                </option>
              ))}
            </select>
            {errors.billTypeId && (
              <p className="text-red-500">{errors.billTypeId}</p>
            )}
          </div>

          {isRentType && formData.tenantId && (
            <div className="mb-4 p-3 rounded-lg shadow flex space-x-6">
              <div>
                Lease Start:{" "}
                <span className="font-medium">
                  {leaseStartDate
                    ? new Date(leaseStartDate).toISOString().split("T")[0]
                    : "N/A"}
                </span>
              </div>

              <div>
                Lease End:{" "}
                <span className="font-medium">
                  {leaseEndDate
                    ? new Date(leaseEndDate).toISOString().split("T")[0]
                    : "N/A"}
                </span>
              </div>

              <div>
                Monthly Rent:{" "}
                <span className="font-semibold">
                  {tenantRent ? `ETB ${tenantRent}` : "N/A"}
                </span>
              </div>
            </div>
          )}

          {!isRentType && tenantPayments.length > 0 && (
            <div className="mb-4 p-3 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Recent Payments</h3>
              <ul className="space-y-2">
                {tenantPayments
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
                  .map((p) => (
                    <li key={p.id} className="border p-2 rounded">
                      <div>
                        <span className="font-medium">
                          {p.BillType?.typeName || "N/A"}
                        </span>{" "}
                        – Paid: ETB {p.amountPaid ?? "N/A"}
                      </div>
                      <div>
                        From:{" "}
                        {p.startDate
                          ? new Date(p.startDate).toISOString().split("T")[0]
                          : "N/A"}
                        &nbsp;To:{" "}
                        {p.endDate
                          ? new Date(p.endDate).toISOString().split("T")[0]
                          : "N/A"}
                      </div>
                      {/* <div>
                        Method: {p.paymentMethod || "N/A"} | Status:{" "}
                        <span className="font-medium">{p.status || "N/A"}</span>
                      </div> */}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div className="flex space-x-4">
            <div className="flex-1">
              <label>Months</label>
              <input
                type="number"
                value={monthsCount}
                onChange={(e) => setMonthsCount(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex-1">
              <label>Days</label>
              <input
                type="number"
                value={daysCount}
                onChange={(e) => setDaysCount(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Rent From</label>
              <SmartDateInput value={startDate} onChange={setStartDate} />
            </div>

            <div>
              <label>Rent To</label>
              <SmartDateInput value={endDate} onChange={setEndDate} />
            </div>
          </div>

          {isRentType && (
            <div>
              <label>Paid Days</label>
              <input
                type="text"
                value={paidDays}
                readOnly
                className="w-full p-2 border rounded text-gray-400"
              />
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              disabled={isRentType}
              onWheel={(e) => e.target.blur()}
              className="w-full bg-base-100 p-2 border rounded-md"
              placeholder="Amount"
              min="0"
              step="1"
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
            <SmartDateInput
              name="dueDate"
              value={formData.dueDate}
              onChange={handleDateChange("dueDate")}
              className="w-full bg-base-100 p-2 border rounded-md"
            />
            {errors.dueDate && <p className="text-red-500">{errors.dueDate}</p>}
          </div>

          {/* Repeated For Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Repeated For
            </label>
            <select
              name="repeatedFor"
              value={formData.repeatedFor}
              onChange={handleInputChange}
              className="w-full bg-base-100 p-2 border rounded-md"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
            {errors.repeatedFor && (
              <p className="text-red-500">{errors.repeatedFor}</p>
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
