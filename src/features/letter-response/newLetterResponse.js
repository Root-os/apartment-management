import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import TitleCard from '../../components/Cards/TitleCard';

const RespondToLetter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const letterId = location.state?.letterId;
  const initialDescription = location.state?.description;

  console.log("Location state:", location.state);
  console.log("Letter ID:", letterId);
  console.log("Initial Description:", initialDescription);

  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const [tenantName, setTenantName] = useState("");
  const [letterDescription, setLetterDescription] = useState(initialDescription || "Loading...");

  // Helper to decode JWT
  const getTenantInfoFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { id: null, fullName: "" };
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return {
        id: decoded?.id || null,
        fullName: decoded?.fullName || "",
      };
    } catch {
      return { id: null, fullName: "" };
    }
  };

  const { id: tenantId, fullName } = getTenantInfoFromToken();

  useEffect(() => {
    setTenantName(fullName);

    const fetchLetterDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}letter/${letterId}`
        );
        setLetterDescription(response.data?.data?.description || "N/A");
      } catch (err) {
        setLetterDescription("Failed to load description");
      }
    };

    // Fetch only if description wasn't passed in state
    if (letterId && !initialDescription) {
      fetchLetterDetails();
    }
  }, [letterId, fullName, initialDescription]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tenantId || !letterId) {
      setFeedback({ type: "error", text: "Missing tenant or letter ID." });
      return;
    }

    const formData = new FormData();
    formData.append("tenantId", tenantId);
    formData.append("letterId", letterId);
    formData.append("message", message);
    if (image) formData.append("image", image);

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}letter-response`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFeedback({ type: "success", text: "Response submitted successfully!" });
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      setFeedback({ type: "error", text: "Failed to submit response." });
    }
  };

  return (
    <>
    <TitleCard title="New Letter Response" topMargin={'mt-1'}>
   
      <div className="mb-4">
        {/* <p><strong>Tenant Name:</strong> {tenantName}</p> */}
        <p><strong>Letter Description:</strong> {letterDescription}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={5}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Attach Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Response
        </button>

        {feedback.text && (
          <p
            className={`mt-4 text-sm ${
              feedback.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {feedback.text}
          </p>
        )}
      </form>
      </TitleCard>
        <div>   <button
        onClick={() => navigate(-1)} 
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mb-6"
      >
        ← Back
      </button></div>
    </>
  );
};

export default RespondToLetter;
