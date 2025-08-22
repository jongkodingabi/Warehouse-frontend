import axiosInstance from "@/lib/axios";

export const audtiData = async (
  id: number,
  updatedDataAudit: {
    user_id: number;
    deskripsi: string;
    stock: number;
    type: string
}
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/auditlog/${id}`,
      updatedDataAudit,
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
