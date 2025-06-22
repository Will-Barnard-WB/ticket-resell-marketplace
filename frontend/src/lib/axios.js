import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "/api", // use relative path, so Vite proxy handles it in dev
    withCredentials: true,
  });
  
export default axiosInstance;