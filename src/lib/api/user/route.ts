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
    const response = await axiosInstance.post("/api/v1/user", newUser, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  await axiosInstance.delete(`/api/v1/user/${id}`);
};

export const updateUser = async (
  id: number,
  updatedUser: {
    name: string;
    email: string;
    role: string;
    password: string;
    jabatan_id: number;
    divisi_id: number;
  }
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/user/${id}`,
      updatedUser,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    // Log error response untuk debugging

    throw error;
  }
};
