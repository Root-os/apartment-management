import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache"
  }
});

// ------------------------------
// GLOBAL ERROR HANDLER
// ------------------------------
api.interceptors.response.use(
  response => response,
  error => {
    console.error("🌐 Global Axios Error:", error);

    let message = "Something went wrong. Please try again.";

    if (error.response) {
      message = error.response.data?.message 
        || `Server Error: ${error.response.status}`;
    } 
    else if (error.request) {
      message = "No response from server. Possible network or CORS issue.";
    } 
    else {
      message = "Unexpected error occurred.";
    }

    error.customMessage = message;
    return Promise.reject(error);
  }
);

export default api;
