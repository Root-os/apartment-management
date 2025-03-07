import React, { useEffect, useState } from "react";
import axios from "axios";

const RecentComplaintList = () => {
  const [complaints, setComplaints] = useState([]);

  const token=localStorage.getItem("token");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}complaints/all`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
  
        });
        if (response.data) {
          const sortedComplaints = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
          setComplaints(sortedComplaints);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchComplaints();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 dark:bg-slate-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Recent Complaints</h1>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 ">
        {complaints.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {complaints.map((complaint) => (
              <li key={complaint.id} className="py-4">
                <div className="text-lg font-medium">{complaint.Tenant.fullName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {complaint.description} ({complaint.urgency})
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  Status: {complaint.status}, Feedback: {complaint.tenantFeedback}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-300">No complaints found.</div>
        )}
      </div>
    </div>
  );
};

export default RecentComplaintList;