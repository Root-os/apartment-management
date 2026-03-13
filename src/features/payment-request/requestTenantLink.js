import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import api from '../../utils/api';
import LoadingComponent from '../../components/loading';
import Modal from '../../components/Modal';

const TenantPaymentVerificationPage = () => {
  const { token } = useParams();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // verification modal state
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [verifyPaymentMethod, setVerifyPaymentMethod] = useState('');
  const [transactionNumber, setTransactionNumber] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);

  // supporting data
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState([]);
  const [receiverInfo, setReceiverInfo] = useState({ name: '', account: '' });

  // feedback modal
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [currentRequestId, setCurrentRequestId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return; 
    fetchAll();
  }, [token]);

  const fetchAll = async () => {
  setLoading(true);
  try {
    const [requestsRes, typesRes, settingsRes, punishmentsRes] = await Promise.all([
      api.get(`/payment-requests/by-link/${token}`),
      api.get('payment-types'),
      api.get('payment-settings'),
      api.get('/punishments'), // <-- fetch all punishments
    ]);

    const rentType = typesRes.data.find(t => t.name === 'Rent');
    const punishments = punishmentsRes.data || [];

    const requestsWithPunishment = (requestsRes.data.data || []).map((req) => {
      let punishmentAmount = 0;

      // Only check punishment if payment type is Rent
      if (req.paymentTypeId === rentType?.id) {
        const tenantPunishment = punishments.find(
          p => p.tenantId === req.tenantId && p.status === 'unpaid'
        );
        punishmentAmount = tenantPunishment?.amount || 0;
      }

      return {
        ...req,
        punishmentAmount,
        totalAmount: req.amount + punishmentAmount,
      };
    });

    const sortedRequests = requestsWithPunishment.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setRequests(sortedRequests);
    setCurrentRequestId(sortedRequests[0]?.id || null);

    setPaymentTypes(typesRes.data);
    setPaymentSettings(settingsRes.data.data);

    if (settingsRes.data.data.length > 0) {
      const first = settingsRes.data.data[0];
      setVerifyPaymentMethod(first.paymentMethod);
      setReceiverInfo({
        name: first.receiverName,
        account: first.receiverAccountNumber,
      });
    }
  } catch {
    setMessage('Invalid or expired payment link'); 
    setMessageType('error');
    setModalOpen(true);
  } finally {
    setLoading(false);
  }
};


  const handleVerifyPayment = async () => {
    if (!selectedRequest) return;

    setVerifyLoading(true);
    try {
      const res = await api.post(
        `payment-requests/${selectedRequest.id}/verify`,
        {
          paymentMethod: verifyPaymentMethod,
          transactionNumber,
        },
        { params: { amount: selectedRequest.totalAmount } }

      );

      setMessageType(res.data.success ? 'success' : 'error');
      setMessage(res.data.message || 'Payment verified successfully');
      setVerifyModalOpen(false);
      fetchAll();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Verification failed'
      );
      setMessageType('error');
      setVerifyModalOpen(false);
    } finally {
      setVerifyLoading(false);
      setModalOpen(true);
    }
  };

  
const handleGoToDashboard = () => {
navigate("/tenant-login", {
  state: { redirectTo: "/app" },
});
};

 return (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="bg-white rounded-2xl border shadow-sm p-8">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

    {/* Left content */}
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2"
          />
        </svg>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment Verification
        </h1>
        <p className="text-gray-600 mt-1 max-w-2xl">
          Review your pending payment requests and confirm them using your
          transaction reference.
        </p>
      </div>
    </div>

    {/* Right button */}
    <div className="flex-shrink-0">
      <button
        onClick={handleGoToDashboard}
        className="w-full md:w-auto px-5 py-2.5 rounded-lg
                   bg-gray-900 hover:bg-gray-800
                   text-white font-medium transition"
      >
        Go to dashboard
      </button>
    </div>

  </div>
</div>


      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl border shadow-sm p-12 flex justify-center">
          <LoadingComponent />
        </div>
      )}

      {/* Empty State */}
      {!loading && requests.length === 0 && (
        <div className="bg-white rounded-2xl border shadow-sm p-14 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            No pending payments
          </h3>
          <p className="text-gray-500 mt-2">
            You don’t have any payments waiting for verification right now.
          </p>
        </div>
      )}

      {/* Payments List */}
      {!loading && requests.length > 0 && (
        <div className="space-y-4">

          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-4 gap-4 px-6 text-sm font-medium text-gray-500">
            <span>Amount</span>
            <span>Type</span>
            <span>Due date</span>
            <span className="text-right">Action</span>
          </div>

          {requests.map((row) => (
            <div
              key={row.id}
              className={`relative bg-white rounded-2xl border shadow-sm
                px-6 py-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center
                transition-all hover:-translate-y-[1px] hover:shadow-md
                ${row.id === currentRequestId
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : ''}
              `}
            >
              {/* Accent */}
              {row.id === currentRequestId && (
                <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-l-2xl" />
              )}

              <div>
                <p className="text-xs text-gray-500 md:hidden mb-1">Amount</p>
                <p className="text-xl font-semibold text-gray-900">
                  {Math.round(row.amount)} <span className="text-sm text-gray-500">ETB</span>
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 md:hidden mb-1">Payment Type</p>
                <p className="text-gray-800">
                  {row.PaymentType?.name || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 md:hidden mb-1">Due Date</p>
                <p className="text-gray-700">
                  {new Date(row.dueDate).toLocaleDateString()}
                </p>
              </div>

              <div className="md:text-right">
                <button
                  onClick={() => {
                    setSelectedRequest(row);
                    setTransactionNumber('');
                    setVerifyModalOpen(true);
                  }}
                  className="w-full md:w-auto px-5 py-2.5 rounded-lg
                             bg-blue-600 hover:bg-blue-700
                             text-white font-medium transition"
                >
                  Verify payment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verify Modal */}
      {verifyModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Confirm payment
            </h2>

            <div className="space-y-4">

 <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-gray-600"> Amount</span>
    <span className="font-medium text-gray-900">
      {Math.round(selectedRequest.amount)} ETB
    </span>
  </div>

  {selectedRequest.punishmentAmount > 0 && (
    <div className="flex justify-between text-sm text-red-600">
      <span>Punishment</span>
      <span className="font-medium">
        {Math.round(selectedRequest.punishmentAmount)} ETB
      </span>
    </div>
  )}

  <div className="border-t pt-2 flex justify-between text-base font-semibold">
    <span>Total to verify</span>
    <span>
      {Math.round(selectedRequest.totalAmount)} ETB
    </span>
  </div>
</div>


              {receiverInfo.name && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
                  <p><strong>Receiver:</strong> {receiverInfo.name}</p>
                  <p><strong>Account:</strong> {receiverInfo.account}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Payment method
                </label>
                <select
                  value={verifyPaymentMethod}
                  onChange={(e) => {
                    const selected = paymentSettings.find(
                      m => m.paymentMethod === e.target.value
                    );
                    setVerifyPaymentMethod(e.target.value);
                    setReceiverInfo({
                      name: selected?.receiverName || '',
                      account: selected?.receiverAccountNumber || '',
                    });
                  }}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  {paymentSettings.map(m => (
                    <option key={m.id} value={m.paymentMethod}>
                      {m.paymentMethod}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Transaction reference
                </label>
                <input
                  type="text"
                  value={transactionNumber}
                  onChange={(e) => setTransactionNumber(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. FT23409823"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setVerifyModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyPayment}
                  disabled={verifyLoading}
                  className={`px-4 py-2 rounded-lg text-white font-medium
                    ${verifyLoading
                      ? 'bg-gray-400'
                      : 'bg-blue-600 hover:bg-blue-700'}
                  `}
                >
                  {verifyLoading ? 'Verifying…' : 'Confirm payment'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        messageType={messageType}
        message={message}
      />
    </div>
  </div>
);

};

export default TenantPaymentVerificationPage;
