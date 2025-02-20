import React, { useState, useMemo } from 'react';
<<<<<<< HEAD
import { FaPlus, FaSortUp, FaSortDown, FaDownload, FaSearch, FaThList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
=======
import { FaPlus, FaSortUp, FaSortDown, FaDownload, FaSearch, FaThList, FaChevronLeft, FaChevronRight, FaPrint } from 'react-icons/fa';
>>>>>>> origin/rodas
import { CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';

const TableComponent = ({ 
  title, 
  data, 
  columns, 
  rowsPerPageOptions = [5, 10, 15], 
  showSearch = true, 
  exportable = true, 
  onAdd
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
    doc.autoTable({ html: '#table' });
    doc.save(`${title}.pdf`);
  };

<<<<<<< HEAD
=======
  const handlePrint = () => {
    window.print();
  };

>>>>>>> origin/rodas
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
<<<<<<< HEAD
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      {/* Title Card */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center space-x-4">
          {onAdd && (
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
=======
    <div className="p-6 bg-base-100 rounded-lg shadow-md ">
      {/* Title Card */}
      <div className="flex justify-between items-center mb-4 mt-10">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center space-x-2">
          {onAdd && (
            <button 
              className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
>>>>>>> origin/rodas
              onClick={onAdd}
            >
              <FaPlus /> Add
            </button>
          )}
          {exportable && (
            <>
              <CSVLink
                data={data}
                filename={`${title}.csv`}
<<<<<<< HEAD
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <FaDownload /> Export CSV
              </CSVLink>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={handleExportPDF}
              >
                <FaDownload /> Export PDF
=======
                className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
              >
                <FaDownload />  CSV
              </CSVLink>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                onClick={handleExportPDF}
              >
                <FaDownload />  PDF
              </button>
              <button
                className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                onClick={handlePrint}
              >
                <FaPrint /> Print
>>>>>>> origin/rodas
              </button>
            </>
          )}
        </div>
      </div>
<<<<<<< HEAD

=======
     <div className="flex justify-between space-y-4"> 
>>>>>>> origin/rodas
      {/* Search Bar */}
      {showSearch && (
        <div className="mb-4 flex items-center border p-2 rounded-lg">
          <FaSearch className="mr-2" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
<<<<<<< HEAD
            className="w-full p-1 border-0 outline-none bg-base-100"
=======
            className="w-1/2 p-1 border-0 outline-none bg-base-100"
>>>>>>> origin/rodas
          />
        </div>
      )}

      {/* Density Dropdown */}
<<<<<<< HEAD
      <div className="mb-4 flex items-center space-x-2">
=======
      <div className="mb-8 flex items-center space-x-2">
>>>>>>> origin/rodas
        <FaThList />
        <select 
          onChange={(e) => setDensity(e.target.value)} 
          value={density}
          className="border rounded-lg p-1 bg-base-100"
        >
          <option value="comfortable">Comfortable</option>
          <option value="compact">Compact</option>
        </select>
      </div>
<<<<<<< HEAD

=======
      </div>
>>>>>>> origin/rodas
      {/* Table */}
      <table className="min-w-full table-auto border-collapse" id="table">
        <thead>
          <tr className="border-b bg-gray-100">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-2 text-left font-medium text-gray-700 cursor-pointer"
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
<<<<<<< HEAD
            <tr key={index} className="border-b hover:bg-gray-50">
=======
            <tr key={index} className="border-b">
>>>>>>> origin/rodas
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
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
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
            className="px-3 py-1 rounded-lg border bg-white"
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded-lg border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
            className="px-3 py-1 rounded-lg border bg-white"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;