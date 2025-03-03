import axios from "axios"

const checkAuth = () => {
  const token = localStorage.getItem('token');  // Get token from localStorage
  return token ? true : false;  // Return the token if present, otherwise return null
};

export default checkAuth