import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import TableComponent from '../../components/table';
import Modal from '../../components/Modal';
import LoadingComponent from '../../components/loading';
import SmartDateInput from "../../components/Common/smartDatePicker";
import { CalendarContext } from '../../context/calendarContext';
import api from '../../utils/api'

const TenantBillReport = () => {
  const [tenants, setTenants] = useState([]);
  const [billTypes, setBillTypes] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]); 
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [filterParams, setFilterParams] = useState({
    startDate: "",
    endDate: "",
    billPaymentTypeId: "",
    tenantId: "",
  });
   const {  formatDateForDisplay } = useContext(CalendarContext);

  useEffect(() => {
    const fetchTenants = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`tenant`);
        setTenants(response.data);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBillTypes = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`bill-type`);
        setBillTypes(response.data);
       
      } catch (error) {
        console.error("Error fetching bill types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUniqueTenants = async () => {
      try {
        const response = await api.get("tenant/floor-units");
        const tenants = [];

        response.data.forEach((t) => {
          // Pick the first tenant record for this phone number
          if (t.tenant?.length > 0) {
            tenants.push({
              phoneNumber: t.phoneNumber,
              fullName: t.fullName,
              tenantId: t.tenant[0].tenantId, // first lease tenantId
            });
          }
         });
        setTenants(tenants);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    fetchTenants();
    fetchBillTypes();
     fetchUniqueTenants();
 // Fetch payment types
  }, []);

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post(`tenant-payments/reports`, filterParams);
      setFilteredData(response.data);
    } catch (error) {
      const message = error.response?.status === 404
        ? "No payments found with the given filters"
        : "Error filtering data. Please try again.";
      setModalMessage(message);
      setIsModalOpen(true);
      console.error("Error filtering data:", error);
      setFilteredData([]); 
    } finally {
      setIsLoading(false);
    }
  };

    const handleResetFilters = () => {
    setFilterParams({
    startDate: "",
    endDate: "",
    billPaymentTypeId: "",
    tenantId: "",
    });
  };
  const columns = [
    { key: 'tenantName', label: 'Tenant Name', render: (payment) => payment?.Tenant?.fullName || 'N/A' },
    { key: 'floorNumber', label: 'Floor ', render: (payment) => payment?.Tenant?.Floor?.floorNumber || 'N/A' },
    { key: 'unitNumber', label: 'Unit ', render: (payment) => payment?.Tenant?.Unit?.unitNumber || 'N/A' },
    { key: 'billTypeName', label: 'Bill Type', render: (payment) => payment?.BillType?.typeName || 'N/A' },
    { key: 'amountPaid', label: 'Amount Paid', render: (payment) => payment?.amountPaid ?? 'N/A' },
    { key: 'startDate', label: 'Start Date', render: (payment) => payment.startDate ? formatDateForDisplay(payment.startDate) : '-'},
    { key: 'endDate', label: 'End Date', render: (payment) => formatDateForDisplay(payment.endDate)},
    { key: 'status', label: 'Status', render: (payment) => payment?.status || 'N/A' },
  ];

  return (
    <div className="p-8">
      <div>
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-4 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-white-600 dark:text-gray-300">Start Date</label>
            <SmartDateInput
              id="startDate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.startDate}
              onChange={(date) => setFilterParams({ ...filterParams, startDate: date })}
            />
            
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-white-600 dark:text-gray-300">End Date</label>
            <SmartDateInput
              id="endDate"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.endDate}
              onChange={(date) => setFilterParams({ ...filterParams, endDate: date})}
            />
          </div>
          <div>
            <label htmlFor="tenantId" className="dark:text-gray-300 block text-sm font-medium text-gray-700">
              Tenant
            </label>
            <select
              id="tenantId"
              name="tenantId"
              value={filterParams.tenantId || ""}
              onChange={(e) => setFilterParams(prev => ({ ...prev, tenantId: e.target.value }))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.tenantId} value={tenant.tenantId}>
                  {tenant.fullName} ({tenant.phoneNumber})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="billPaymentTypeId" className="block text-sm font-medium text-white-600 dark:text-gray-300">Bill Type</label>
            <select
              id="billPaymentTypeId"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              value={filterParams.billPaymentTypeId}
              onChange={(e) => setFilterParams({ ...filterParams, billPaymentTypeId: e.target.value })}
            >
              <option value="">Select Bill Type</option>
              {billTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.typeName}</option>
              ))}
            </select>
          </div>
          <div className="col-span-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Reset
            </button>
            <button
              type="submit"
              className="w-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:text-gray-300"
            >
              {isLoading ? "Processing..." : "Filter Data"}
            </button>
          </div>
        </form>
      </div>
      {isLoading ? (
        <LoadingComponent />
      ) : filteredData.length > 0 ? (
        <TableComponent
          title="Tenant Bill Report"
          data={filteredData}
          columns={columns}
         rowsPerPageOptions={[5, 10, 15]}

          showSearch={true}
          exportable={true}
        />
      ) : (
        <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
          <TableComponent
            title="Tenant Bill Report"
            data={[]}
            columns={columns}
            showSearch={false}
            exportable={false}
          />
          <p>No data available for the selected filters.</p>
        </div>
      )}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type="error"
          message={modalMessage}
        />
      )}
    </div>
  );
};

export default TenantBillReport;
