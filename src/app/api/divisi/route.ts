import axiosInstance from "@/lib/axios";

export const fetchDivisi = async () => {
  await axiosInstance.get("/api/v1/divisi");
};

export const createDivisi = async (newDivisi: {
  kodedivisi: string;
  divisi: string;
  status: string;
}) => {
  try {
    const response = await axiosInstance.post("/api/v1/divisi", newDivisi, {
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

export const updateDivisi = async (
  id: number,
  updatedCategory: {
    kodedivisi: string;
    divisi: string;
    status: string;
  }
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/divisi/${id}`,
      updatedCategory,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteDivisi = async (id: number) => {
  await axiosInstance.delete(`/api/v1/divisi/${id}`);
};
