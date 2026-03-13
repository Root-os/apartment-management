// components/ImportTenantsModal.jsx
import React, { useState, useRef } from "react";
import api from "../../utils/api";

const ImportTenantsModal = ({ isOpen, onClose }) => {
  const [excelFile, setExcelFile] = useState(null);
  const [importResults, setImportResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!excelFile) return;

    setLoading(true);
    setImportResults([]);
    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const res = await api.post("/import/tenants", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImportResults(res.data.results);
      setMessage("Import completed!");
    } catch (err) {
      setImportResults([
        {
          row: "Excel import",
          success: false,
          error: err.response?.data?.error || err.message,
        },
      ]);
      setMessage("Import failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Import Tenants</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {message && (
            <p
              className={`text-sm ${
                importResults.some((r) => !r.success) ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          <input
            type="file"
            accept=".xlsx, .xls"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div className="flex gap-2">
            <button
              onClick={handleSelectFile}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Select Excel File
            </button>

            {excelFile && (
              <button
                onClick={handleImport}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Importing..." : "Import"}
              </button>
            )}
          </div>

          {excelFile && (
            <p className="text-sm text-gray-600">
              Selected File: <span className="font-medium">{excelFile.name}</span>
            </p>
          )}

          {importResults.length > 0 && (
            <div className="max-h-64 overflow-y-auto border rounded-md p-2">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Row</th>
                    <th className="border p-2 text-left">Success</th>
                    <th className="border p-2 text-left">Error</th>
                     <th className="border p-2 text-left">Password</th>
                  </tr>
                </thead>
                <tbody>
                  {importResults.map((r, idx) => (
                    <tr key={idx} className={r.success ? "bg-green-50" : "bg-red-50"}>
                      <td className="border p-2">{r.row}</td>
                      <td className="border p-2">{r.success ? "✅" : "❌"}</td>
                      <td className="border p-2">{r.error || ""}</td>
                      <td className="border p-2 font-mono">{r.password || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportTenantsModal;
