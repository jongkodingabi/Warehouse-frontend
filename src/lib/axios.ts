import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let controllers: AbortController[] = [];

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  const expiresAt = Cookies.get("token_expires_at");

  if (expiresAt && dayjs().isAfter(dayjs(expiresAt))) {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("token_expires_at");
    window.location.href = "/login";
    throw new Error("Token expired");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const controller = new AbortController();
  config.signal = controller.signal;
  controllers.push(controller);

  return config;
});
export const cancelAllRequests = () => {
  controllers.forEach((c) => c.abort());
  controllers = [];
};

export default api;
