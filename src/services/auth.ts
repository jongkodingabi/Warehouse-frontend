import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { User } from "@/utils/types";

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

  // Cek apakah token ada
  if (!token) {
    return null;
  }

  try {
    const res = await axiosInstance.get<{ user: User } | User>("/api/v1/me");
    return (res.data as any).user ?? (res.data as User);
  } catch (error) {
    return null;
  }
};

export const logout = async () => {
  await getCsrf();
  return axiosInstance.post("/api/v1/logout");
};
// export const register = async ()
