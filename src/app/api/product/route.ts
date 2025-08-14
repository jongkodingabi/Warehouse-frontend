import axiosInstance from "@/lib/axios";

export const createBarang = async (newProduct: {
  produk: string;
  production_date: any;
  stock: number;
  kategori_id: any;
  kodegrp: string;
  status: string;
  line_divisi: number;
  main_product: number;
  created_by: any;
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

export const deleteBarang = async (id: number) => {
  await axiosInstance.delete(`/api/v1/barang/${id}`);
};
