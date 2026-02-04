import React, { useState, useMemo, useContext } from 'react';
import { FaPlus, FaSortUp, FaSortDown, FaDownload, FaSearch, FaThList, FaChevronLeft, FaChevronRight, FaPrint } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CalendarContext } from '../context/calendarContext';



const TableComponent = ({ 
  title, 
  data, 
  columns, 
  rowsPerPageOptions = [30, 50, 100], 
  showSearch = true,
  exportable = true, 
  onAdd,
  customHeader,
  statusFilter,
  exportConfig
}) => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: columns[0]?.key, direction: 'asc' });
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [density, setDensity] = useState('comfortable'); 
  const { isGregorian, formatDateForDisplay } = useContext(CalendarContext);

  console.log(`🧭 Table "${title}" using calendar:`, isGregorian ? "Gregorian" : "Ethiopian");

  const normalizeDateString = (value) => {
  if (!value) return value;

  if (typeof value === "string" && value.includes("T")) {
    return value.split("T")[0]; // YYYY-MM-DD
  }

  return value;
};



  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const getExportRows = () => {
  if (!exportConfig?.length) return [];

  return data.map(row => {
    const obj = {};
    exportConfig.forEach(col => {
      let value = col.getValue(row);

      // format dates like PDF
      if (typeof value === 'string' && value.includes('T')) {
        value = formatDateForDisplay(normalizeDateString(value));
      }

      obj[col.label] = value ?? '';
    });

    return obj;
  });
};


const handleExportPDF = () => {
  if (!exportConfig?.length) return;

  const doc = new jsPDF({
    orientation: 'landscape', // wider table
    unit: 'pt',               // points (better control)
    format: 'a4',             // A4 page
  });

  doc.setFontSize(12);       // increase default font size
  doc.text(title, 40, 40);   // adjust title position

  const headers = exportConfig.map(col => col.label);

  const rows = data.map(row =>
    exportConfig.map(col => {
      let value = col.getValue(row);

      if (typeof value === 'string' && value.includes('T')) {
        value = formatDateForDisplay(normalizeDateString(value));
      }

      return value ?? '';
    })
  );

  doc.autoTable({
    startY: 60,              // space below title
    head: [headers],
    body: rows,
    styles: {
      fontSize: 11,          // font size for table
      cellPadding: 6,        // more padding for clarity
    },
    headStyles: {
      fillColor: [41, 128, 185], // blue header
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles: {
      // auto-width or you can fix widths for specific columns
      0: { cellWidth: 100 },  // first column
      1: { cellWidth: 80 },   // second column
    },
    margin: { top: 60, left: 40, right: 40 }, // page margins
    pageBreak: 'auto',       // auto handle multi-page
  });

  doc.save(`${title}.pdf`);
};



  const handlePrint = () => {
    window.print();
  };

  const toggleDensity = () => {
    setDensity(density === 'comfortable' ? 'compact' : 'comfortable');
  };

  const filterData = useMemo(() => {
    return data.filter(item => {
      return columns.some(column => {
        const value = item[column.key]?.toString()?.toLowerCase() || '';
        return value.includes(search.toLowerCase());
      });
    });
  }, [data, search, columns]);

  const sortedData = useMemo(() => {
    return [...filterData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filterData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filterData.length / rowsPerPage);

  // Define padding based on the selected density
  const rowPadding = density === 'comfortable' ? 'py-4' : 'py-2';


  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md w-full overflow-x-auto">
      {/* Title Card */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="flex justify-end items-center mb-4 mt-6">
        <div className="flex items-center space-x-2">
          {onAdd && (
            <button 
              className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-all duration-300"
              onClick={onAdd}
            >
              <FaPlus className="text-lg" /> <span>Add</span>
            </button>
          )}
          {exportable && (
            <>
    <CSVLink
      data={getExportRows()} 
      filename={`${title}.csv`}
      className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm transition-all duration-300"
    >
      <FaDownload className="text-lg" /> <span>Export CSV</span>
    </CSVLink>
              <button
                className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm transition-all duration-300"
                onClick={handleExportPDF}
              >
                <FaDownload className="text-lg" /> <span>Export PDF</span>
              </button>
              <button
                className="flex items-center space-x-1 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm transition-all duration-300"
                onClick={handlePrint}
              >
                <FaPrint className="text-lg" /> <span>Print</span>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">  
      {showSearch && (
        <div className="mb-4 flex items-center border p-2 rounded-lg">
          <FaSearch className="mr-2" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
            className="w-1/2 p-1 border-0 outline-none bg-base-100"
          />
        </div>
      )}
         {customHeader}
         {statusFilter}
      {/* Density Toggle */}
      <div className="mb-4 flex items-center space-x-2">
        <FaThList onClick={toggleDensity} className="cursor-pointer" />
      </div>
      </div>
      {/* Table */}
      <div className="print-area">
        <table className="min-w-full table-auto border-collapse print:hidden" id="table">
          <thead>
            <tr className="border-b bg-base-300 ">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-2 text-left font-medium text-white-700 cursor-pointer"
                  onClick={() => handleSort(column.key)}
                >
                  {column.label}
                  {sortConfig.key === column.key && (
                    sortConfig.direction === 'asc' ? <FaSortUp className="inline" /> : <FaSortDown className="inline" />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className="border-b">
                {columns.map((column) => {
                  let cellValue = row[column.key];

                  // ✅ Auto-format date fields (unless custom render is provided)
                  if (!column.render && typeof cellValue === 'string') {
                    const lowerKey = column.key.toLowerCase();
                    if (
                      lowerKey.includes('date') ||
                      lowerKey.endsWith('at') ||
                      lowerKey.startsWith('date')
                    ) {
                    console.log(`📅 Formatting field "${column.key}" with value:`, cellValue);

                    const normalizedDate = normalizeDateString(cellValue);
                    cellValue = formatDateForDisplay(normalizedDate);

                    console.log(`🗓️ Formatted (${isGregorian ? "Gregorian" : "Ethiopian"}):`, cellValue);
                    }
                  }

                  return (
                    <td key={column.key} className={`px-4 ${rowPadding}`}>
                      {column.render ? column.render(row) : cellValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Print-only table, shows all filtered & sorted data */}
        <table className="min-w-full table-auto border-collapse hidden print:table" id="print-table">
          <thead>
            <tr className="border-b bg-base-300 ">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-2 text-left font-medium text-white-700"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index} className="border-b">
                {columns.map((column) => (
                <td key={column.key} className={`px-4 ${rowPadding}`}>
                    {column.render
                      ? column.render(row)
                      : (() => {
                          const value = row[column.key];
                          if (typeof value === "string") {
                            const lowerKey = column.key.toLowerCase();
                            if (
                              lowerKey.includes("date") ||
                              lowerKey.endsWith("at") ||
                              lowerKey.startsWith("date")
                            ) {
                              return formatDateForDisplay(normalizeDateString(value));
                            }
                          }
                          return value;
                        })()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        {/* Rows per page */}
        <div className="flex items-center space-x-2 bg-base-200">
          {/* <span>Rows per page:</span> */}
          <select 
            onChange={(e) => setRowsPerPage(Number(e.target.value))} 
            value={rowsPerPage}
            className="border rounded-lg p-1"
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination Controls */}
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
            className="px-3 py-1 rounded-lg border bg-base-200"
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-lg border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-base-200'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
            className="px-3 py-1 rounded-lg border bg-base-200"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
