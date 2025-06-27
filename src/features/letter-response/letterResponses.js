import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import TitleCard from "../../components/Cards/TitleCard";

const LetterResponseView = () => {
  const { letterId: paramLetterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const letterId = paramLetterId || location.state?.letterId;
  const letterDescription = location.state?.description || "N/A";

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [editImage, setEditImage] = useState(null);

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("message", editMessage);
    formData.append("letterId", letterId);
    if (editImage) formData.append("image", editImage);

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BASE_URL}letter-response/${response.id}`,
        formData
      );
      setResponse(res.data.data);
      setShowEdit(false);
    } catch (err) {
      alert("Failed to update response");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}letter-response/${response.id}`
      );
      setShowDeleteConfirm(false);
      navigate(-1); // go back
    } catch (err) {
      alert("Failed to delete response");
    }
  };

  return (
    <div className="p-6">
      {/* Back Button - Always visible */}
     <div className="mb-6">
        {response && (
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-center font-semibold">{error}</div>
      )}

      {/* Loading Indicator */}
      {!response && !error && (
        <div className="text-center text-gray-500">Loading response...</div>
      )}

      {/* Response Display */}
      {response && (
        <TitleCard title="Letter Response" topMargin={"mt-1"}>
          <table className="min-w-full border border-gray-300 rounded-md text-left">
            <tbody>
              <tr className="border-b">
                <th className="p-3 font-medium text-gray-700 w-1/4">
                  Letter Description
                </th>
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
                  <th className="p-3 font-medium text-gray-700">
                    Attached Image
                  </th>
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
                  {new Intl.DateTimeFormat("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZone: "UTC",
                    hour12: false,
                  }).format(new Date(response.createdAt))}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex gap-4 mt-6">
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={() => {
                setEditMessage(response.message);
                setShowEdit(true);
              }}
            >
              Edit
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </button>
          </div>
        </TitleCard>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded shadow-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Response</h3>
            <textarea
              className="w-full p-2 border rounded mb-4"
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImage(e.target.files[0])}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <p className="mb-4">
              Are you sure you want to delete this response?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterResponseView;
