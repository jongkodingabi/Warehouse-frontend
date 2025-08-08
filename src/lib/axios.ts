import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer " + (typeof window !== "undefined" ? Cookies.get("token") : ""),
  },
});

export default axiosInstance;
