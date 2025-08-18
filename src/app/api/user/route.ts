import axiosInstance from "@/lib/axios";

export const createUser = async (newUser: {
  name: string;
  email: string;
  role: string;
  password: string;
  jabatan_id: number;
  divisi_id: number;
}) => {
  try {
    console.log(newUser);
    const response = await axiosInstance.post("/api/v1/user", newUser, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};
