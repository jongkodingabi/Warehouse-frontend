import axiosInstance from "@/lib/axios";
import { Category } from "@/utils/types";

export const createCategory = async (newCategory: {
  kategori: string;
  status: string;
}) => {
  try {
    const response = await axiosInstance.post("/api/v1/kategori", newCategory, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategory = () => {
  axiosInstance.get("/api/v1/kategori");
};

export const deleteCategory = async (id: number) => {
  await axiosInstance.delete(`/api/v1/kategori/${id}`);
};

export const updateCategory = async (
  id: number,
  updatedCategory: { kategori: string; status: string }
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/kategori/${id}`,
      updatedCategory,
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
