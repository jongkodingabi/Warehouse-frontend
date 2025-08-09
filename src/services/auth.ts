import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

export type User = {
  id: number;
  name: string;
  email: string;
};

export const getCsrf = () => axiosInstance.get("/sanctum/csrf-cookie");

export const login = async (email: string, password: string) => {
  await getCsrf();
  return axiosInstance.post("/api/v1/login", { email, password });
};

export const fetchUser = async () => {
  const res = await axiosInstance.get<{ user: User } | User>("/api/v1/me");

  return (res.data as any).user ?? (res.data as any);
};

export const logout = async () => {
  await getCsrf();
  return axiosInstance.post("/api/v1/logout");
};
// export const register = async ()
