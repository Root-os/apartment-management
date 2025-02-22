import React from 'react';

const HistoryModal = ({ isOpen, onClose, tenantInfo, paymentHistory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`bg-base-100 ${document.documentElement.classList.contains('dark') ? 'dark' : ''} p-6 rounded-lg w-2/3 max-w-4xl`}>
        <h2 className="text-xl mb-4">Payment History for {tenantInfo?.fullName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong>Tenant Name:</strong> {tenantInfo?.fullName}</p>
          <p><strong>Email:</strong> {tenantInfo?.email || 'No Email'}</p>
          <p><strong>Unit Number:</strong> {tenantInfo?.unitNumber}</p>
          <p><strong>Floor Number:</strong> {tenantInfo?.floorNumber}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg mb-2">Payment History</h3>
          <div className="overflow-auto">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Amount Paid</th>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Payment Date</th>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Paid Days</th>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Payment Method</th>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Payment Frequency</th>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Next Due Date</th>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id}>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{payment.amountPaid}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{payment.paidDays}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{payment.paymentMethod}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{payment.paymentFrequency}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{new Date(payment.nextDueDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;