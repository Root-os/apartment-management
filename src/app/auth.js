import axios from "axios"

const checkAuth = () => {
  const token = localStorage.getItem('token');  // Get token from localStorage
  return token ? token : null;  // Return the token if present, otherwise return null
};

export default checkAuth