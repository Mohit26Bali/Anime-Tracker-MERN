import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  // Required by the backend's CSRF middleware on state-changing requests.
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

export default axiosInstance;
