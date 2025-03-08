import React, { useState, useMemo } from 'react';
import { FaPlus, FaSortUp, FaSortDown, FaDownload, FaSearch, FaThList, FaChevronLeft, FaChevronRight, FaPrint } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TableComponent = ({ 
  title, 
  data, 
  columns, 
  rowsPerPageOptions = [5, 10, 15], 
  showSearch = true, 
  exportable = true, 
  onAdd,
  customHeader,
  statusFilter
}) => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: columns[0]?.key, direction: 'asc' });
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [density, setDensity] = useState('comfortable'); // New state for row density

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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    const tableColumn = columns.map(col => col.label);
    const tableRows = data.map(row => columns.map(col => row[col.key]));
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
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
      <div className="mb-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>

        {/* Icon buttons placed to the end */}
        <div className="flex justify-end items-center space-x-2">
          {onAdd && (
            <button 
              className="flex items-center space-x-1 px-1 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-all duration-300"
              onClick={onAdd}
            >
              <FaPlus className="text-md" /> <span>Add</span>
            </button>
          )}

          {exportable && (
            <>
              <CSVLink
                data={data}
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
          <div className="mb-2 flex items-center border p-2 rounded-lg">
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
      <table className="min-w-full table-auto border-collapse" id="table">
        <thead>
          <tr className="border-b bg-base-300">
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
              {columns.map((column) => (
                <td key={column.key} className={`px-4 ${rowPadding}`}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        {/* Rows per page */}
        <div className="flex items-center space-x-2 bg-base-200">
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
