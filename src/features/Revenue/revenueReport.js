import React, { useState } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}report`, {
        params: { startDate, endDate },
      });
      setReport(res.data);
    } catch (err) {
      console.error('Error fetching report:', err);
      alert('Failed to fetch report. Check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return parseFloat(amount || 0).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderRecords = (records, hasTenant = false) => (
    records.length ? (
      records.map((rec, idx) => (
        <tr key={idx} className="border-b">
          <td className="p-2">{formatAmount(rec.amount)}</td>
          <td className="p-2">{new Date(rec.date).toLocaleDateString()}</td>
          {hasTenant && <td className="p-2">{rec.tenantId}</td>}
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={hasTenant ? 3 : 2} className="p-2 text-gray-400">No records</td>
      </tr>
    )
  );

  const renderSection = (title, data, isIncome = true) => {
    const totalKey = isIncome ? 'totalIncome' : 'totalOutcome';

    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">{title}</h2>

        {Object.entries(data).map(([key, section]) => {
          if (key === totalKey) return null;

          const sectionTotalKey = Object.keys(section).find(k => k.startsWith('total'));
          const totalValue = formatAmount(section[sectionTotalKey]);
          const hasTenant = section.records.some(r => r.tenantId);

          return (
            <div key={key} className="mb-8">
              <h3 className="text-lg font-semibold capitalize mb-1">{key}</h3>
              <table className="w-full border border-gray-300 mb-2">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Date</th>
                    {hasTenant && <th className="p-2 text-left">Tenant ID</th>}
                  </tr>
                </thead>
                <tbody>
                  {renderRecords(section.records, hasTenant)}
                </tbody>
              </table>
              <p className="text-right font-medium">Subtotal: <span className="font-semibold">{totalValue}</span></p>
            </div>
          );
        })}

        <p className="text-right text-xl font-bold mt-6">
          Total {title}: {formatAmount(data[totalKey])}
        </p>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto print:p-4">
      <h1 className="text-3xl font-bold text-center mb-6 print:text-2xl">Revenue Report</h1>

      <div className="flex flex-wrap justify-center gap-4 items-center mb-6 print:hidden">
        <div>
          <label className="mr-2 font-medium">Start Date:</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="mr-2 font-medium">End Date:</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={fetchReport}
        >
          {loading ? 'Loading...' : 'Generate Report'}
        </button>

        {report && (
          <button
            className="bg-green-600 text-white px-2 py-2 rounded hover:bg-green-700"
            onClick={handlePrint}
          >
            🖨️ Print
          </button>
        )}
      </div>

      {report && (
        <div className="mt-4">
          {renderSection('Incomes', report.incomes, true)}
          {renderSection('Expenses', report.outcomes, false)}

          <div className="text-right mt-8 text-2xl font-extrabold text-green-700 print:text-black">
            Net Profit: {formatAmount(report.netIncome)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
