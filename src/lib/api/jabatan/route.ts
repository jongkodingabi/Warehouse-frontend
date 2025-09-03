import axiosInstance from "@/lib/axios";

export const createJabatan = async (newJabatan: { jabatan: string }) => {
  try {
    const response = await axiosInstance.post("/api/v1/jabatan", newJabatan, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteJabatan = async (id: number) => {
  await axiosInstance.delete(`/api/v1/jabatan/${id}`);
};

export const updateJabatan = async (
  id: number,
  updatedJabatan: {
    jabatan: string;
  }
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/jabatan/${id}`,
      updatedJabatan,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
