import axios from "axios";

let logoutHandler = null;

export const registerLogout = (handler) => {
  logoutHandler = handler;
};

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

/* ==============================
   REQUEST INTERCEPTOR
   ============================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ==============================
   RESPONSE INTERCEPTOR
   ============================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if ((status === 401 || status === 403) && logoutHandler) {
      logoutHandler(true);
    }

    return Promise.reject(error);
  }
);

export default api;
