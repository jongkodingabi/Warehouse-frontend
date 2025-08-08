import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

export const getCsrf = () => axiosInstance.get("/sanctum/csrf-cookie");

export const login = async (email: string, password: string) => {
  await getCsrf();
  return axiosInstance.post("/api/v1/login", { email, password });
};

export const logout = async () => {
  await getCsrf();
  return axiosInstance.post("/api/v1/logout");
};
// export const register = async ()
