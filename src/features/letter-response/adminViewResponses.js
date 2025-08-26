import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import TitleCard from '../../components/Cards/TitleCard';
import Loading from '../../components/loading';

const LetterResponseAdminSide = () => {
  const { letterId } = useParams();
  const navigate = useNavigate();

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}letter-response/admin/${letterId}`
        );
        const responses = res.data.data;
        if (Array.isArray(responses) && responses.length > 0) {
          setResponse(responses[0]);
        } else {
          setError("No responses found.");
        }
      } catch (err) {
        setError("Failed to fetch letter response.");
      }
    };

    fetchResponse();
  }, [letterId]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}letter-response/admin/status/${response.id}`,
        { status: newStatus }
      );
      setResponse(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  if (error) return <div className="p-6 text-red-600 text-center font-semibold">{error}</div>;
  if (!response) return <Loading/>

  const letterDescription = response?.Letter?.description || "N/A";

  return (
    <div>
      <TitleCard title="Letter Response" topMargin={'mt-1'}>
        <table className="min-w-full border border-gray-300 rounded-md text-left">
          <tbody>
            <tr className="border-b">
              <th className="p-3 font-medium text-gray-700 w-1/4">Letter Description</th>
              <td className="p-3">{letterDescription}</td>
            </tr>
            <tr className="border-b">
              <th className="p-3 font-medium text-gray-700">Status</th>
              <td className="p-3">{response.status}</td>
            </tr>
            <tr className="border-b">
              <th className="p-3 font-medium text-gray-700">Message</th>
              <td className="p-3">{response.message}</td>
            </tr>
            {response.image && (
              <tr className="border-b">
                <th className="p-3 font-medium text-gray-700">Attached Image</th>
                <td className="p-3">
                  <img
                    src={response.image}
                    alt="Response Attachment"
                    className="max-w-xs max-h-96 object-contain border rounded"
                  />
                </td>
              </tr>
            )}
            <tr>
              <th className="p-3 font-medium text-gray-700">Responded On</th>
              <td className="p-3">
                {new Date(response.createdAt).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Status Update Control */}
        <div className="flex gap-4 mt-6 items-center">
          <label htmlFor="status" className="font-medium text-gray-700">Update Status:</label>
          <select
            id="status"
            value={response.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </TitleCard>

      <div>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mb-6"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default LetterResponseAdminSide;
