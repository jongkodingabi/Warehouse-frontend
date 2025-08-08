import axiosInstance from "@/lib/axios";

export const getCsrf = () => axiosInstance.get("/sanctum/csrf-cookie");

export const login = async (email: string, password: string) => {
  await getCsrf();
  return axiosInstance.post("/login", { email, password });
};

// export const register = async ()
