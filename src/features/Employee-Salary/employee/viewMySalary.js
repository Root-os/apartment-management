import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/table'

const MySalaryPayments = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  
  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}salary-payments/my-history`, {
          headers: {Authorization : `Bearer ${token}`, }
        });
        setSalaryData(response.data.data);
      } catch (err) {
        setError('An error occurred while fetching salary data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, []);


  const columns = [
    { label: 'Payment Method', key: 'paymentMethod' },
    { label: 'Amount', key: 'amount' },
    { label: 'Status', key: 'status' },
    { label: 'Net Salary', key: 'netSalary' },
    { label: 'Income Tax', key: 'incomeTax' },
    { label: 'Payment From Date', key: 'paymentFromDate', 
      render: (row) => {
        if (row.paymentFromDate) {
          const date = new Date(row.paymentFromDate);
          return date.toLocaleDateString('en-US'); 
        }
        return 'N/A';
      }
    },
    { label: 'Payment To Date', key: 'paymentToDate',
      render: (row) => {
        if (row.paymentToDate) {
          const date = new Date(row.paymentToDate);
          return date.toLocaleDateString('en-US'); 
        }
        return 'N/A';
      }
     },
    { label: 'Pension Contribution', key: 'pensionContribution' },
  ];

  return (
    <>
      {/* Loading State */}
        <TableComponent
          title="Salary"
          data={salaryData}
          columns={columns}
        />
      
    </>
  );
};

export default MySalaryPayments;
