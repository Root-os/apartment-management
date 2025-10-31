import React, { useState, useContext } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from 'react-router-dom';
import SmartDateInput from "../../components/Common/smartDatePicker";
import { CalendarContext } from '../../context/calendarContext';

const ReportPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { formatDateForDisplay } = useContext(CalendarContext);

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}report`, {
        params: { startDate, endDate },
      });
      setReport(res.data);
    } catch (err) {
      console.error("Error fetching report:", err);
      alert("Failed to fetch report. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    const num = parseFloat(amount || 0);
    return `ETB ${num.toLocaleString("en-ET", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (!report) return;

    const workbook = XLSX.utils.book_new();

    const addSheet = (data, sheetName) => {
      Object.entries(data).forEach(([key, section]) => {
        if (key.startsWith("total")) return;
        const records = section.records || [];

        if (records.length) {
          const sheetData = records.map((rec) => {
            const row = {};
            Object.keys(rec).forEach((k) => {
              row[k] = rec[k];
            });
            return row;
          });
          const worksheet = XLSX.utils.json_to_sheet(sheetData);
          XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            `${sheetName}-${key}`
          );
        }
      });
    };

    addSheet(report.incomes, "Income");
    addSheet(report.outcomes, "Expenses");

    XLSX.writeFile(workbook, `Income_Statement_${startDate}_to_${endDate}.xlsx`);
  };

  const renderSection = (title, data, isIncome = true) => {
    const totalKey = isIncome ? "totalIncome" : "totalOutcome";

    return (
      <div className="mt-8 break-inside-avoid-page">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">{title}</h2>

        {Object.entries(data).map(([key, section]) => {
          if (key === totalKey) return null;

          const records = section.records || [];
          if (!records.length) {
            return (
              <div key={key} className="mb-8">
                <h3 className="text-lg font-semibold capitalize mb-1">{key}</h3>
                <p className="text-gray-500 italic">No records</p>
              </div>
            );
          }

          const sample = records[0];
          let allCols = Object.keys(sample);
          let sortedColumns = [];

          // Custom sort rules
          if (key === "salaryPayments") {
            sortedColumns = ["user", "netSalary", "allowance", "total", "date"];
          } else if (key === "payments") {
            // Force vendor first, then item/others, then amount before date
            const others = allCols.filter(
              (c) => !["vendor", "amount", "date"].includes(c)
            );
            sortedColumns = ["vendor", ...others, "amount", "date"];
          } else {
            // Default: place amount before date, rest in natural order
            const others = allCols.filter(
              (c) => c !== "amount" && c !== "date"
            );
            if ("amount" in sample) others.push("amount");
            if ("date" in sample) others.push("date");
            sortedColumns = others;
          }

          const sectionTotalKey = Object.keys(section).find((k) =>
            k.startsWith("total")
          );
          const totalValue = formatAmount(section[sectionTotalKey]);

          return (
            <div key={key} className="mb-8">
              <h3 className="text-lg font-semibold capitalize mb-1">{key}</h3>
              <table className="w-full border border-gray-300 mb-2">
                <thead className="bg-gray-100">
                  <tr>
                    {sortedColumns.map((col) => (
                      <th key={col} className="p-2 text-left capitalize">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, idx) => (
                    <tr key={idx} className="border-b">
                      {sortedColumns.map((col) => (
                        <td key={col} className="p-2">
{col === "date"
  ? formatDateForDisplay(rec[col]) // 
  : typeof rec[col] === "number" ||
    /^\d+(\.\d+)?$/.test(rec[col])
  ? formatAmount(rec[col])
  : rec[col] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-right font-medium">
                Subtotal: <span className="font-semibold">{totalValue}</span>
              </p>
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
      <div className="mt-1 flex justify-end gap-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-800 px-4 rounded hover:bg-gray-400 flex items-center gap-2"
        >
          {/* Left Arrow SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
      <h1 className="text-3xl font-bold text-center mb-6 print:text-2xl">
        Income Statement
      </h1>

      <div className="flex flex-wrap justify-center gap-4 items-center mb-6 print:hidden">
        <div>
          <label className="mr-2 font-medium">Start Date:</label>
          <SmartDateInput
            className="border p-2 rounded"
            value={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div>
          <label className="mr-2 font-medium">End Date:</label>
          <SmartDateInput
            className="border p-2 rounded"
            value={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={fetchReport}
        >
          {loading ? "Loading..." : "Generate Report"}
        </button>

        {report && (
          <>
            <button
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              onClick={handlePrint}
            >
              🖨️ Print
            </button>
            <button
              className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
              onClick={handleExport}
            >
              ⬇️ Export
            </button>
          </>
        )}
      </div>

     {report && (
      <div className="print-area mt-4 print:text-sm print:leading-tight">
        {renderSection("Incomes", report.incomes, true)}
        {renderSection("Expenses", report.outcomes, false)}

        <div className={`text-right mt-8 text-2xl font-extrabold ${report.netIncome >= 0 ? "text-green-700" : "text-red-700"} print:text-black`}>
          {report.netIncome >= 0 ? "Net Profit" : "Loss"}: {formatAmount(report.netIncome)}
        </div>
      </div>
     )}
    </div>
  );
};

export default ReportPage;
