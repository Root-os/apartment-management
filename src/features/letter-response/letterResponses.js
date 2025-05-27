import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const LetterResponseView = () => {
  const { letterId: paramLetterId } = useParams();
  const navigate = useNavigate();

  const location = useLocation();

  const letterId = paramLetterId || location.state?.letterId;
  const letterDescription = location.state?.description || "N/A";

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const getTenantIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      return decodedPayload?.id;
    } catch (err) {
      console.error("Token decode error", err);
      return null;
    }
  };

  const tenantId = getTenantIdFromToken();

  useEffect(() => {
    const fetchResponse = async () => {
      if (!tenantId || !letterId) {
        setError("Invalid tenant or letter ID.");
        return;
      }

      try {
        const res = await axios.get(
  `${process.env.REACT_APP_BASE_URL}letter-response/my/${tenantId}/${letterId}`
);

        setResponse(res.data.data);
      } catch (err) {
        setError("Failed to fetch letter response.");
      }
    };

    fetchResponse();
  }, [tenantId, letterId]);

  if (error) {
    return <div className="p-6 text-red-600 text-center font-semibold">{error}</div>;
  }

  if (!response) {
    return <div className="p-6 text-center text-gray-500">Loading response...</div>;
  }

  return (
    <div className="container mx-auto p-6 mt-10 bg-white rounded shadow">
      <button
        onClick={() => navigate(-1)} // Navigates back one step in history
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mb-6"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6">Letter Response</h2>

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
            <th className="p-3 font-medium text-gray-700">Submitted On</th>
            <td className="p-3">
              {new Date(response.createdAt).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex gap-4 mt-6">
        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Edit
        </button>
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Delete
        </button>
      </div>
    </div>
  );
};

export default LetterResponseView;
