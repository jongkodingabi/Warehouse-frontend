import axiosInstance from "@/lib/axios";

export const createProduct = async (newProduct: {
  nama_barang: string;
  kode_qr: string;
  line_divisi: string;
  production_date: string;
  stock: number;
}) => {
  try {
    const response = await axiosInstance.post("/api/v1/barang", newProduct, {
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
