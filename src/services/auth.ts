import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type login = {
  email: string;
  password: string;
};

export const getCsrf = () => axiosInstance.get("/sanctum/csrf-cookie");

export const login = async (values: login) => {
  await getCsrf();
  return axiosInstance.post("/api/v1/login", values);
};

export const fetchUser = async () => {
  const token = Cookies.get("token");
  const res = await axiosInstance.get<{ user: User } | User>("/api/v1/me");

  return (res.data as any).user ?? (res.data as any);
};

export const logout = async () => {
  await getCsrf();
  return axiosInstance.post("/api/v1/logout");
};
// export const register = async ()
