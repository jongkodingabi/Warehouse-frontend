import axiosInstance from "@/lib/axios";

export const createBarang = async (newProduct: {
  produk: string;
  production_date: any;
  stock: number;
  kategori_id: any;
  kodegrp: string;
  status: string;
  line_divisi: number;
  main_produk: number;
  created_by: any;
}) => {
  try {
    console.log("Create new product:", newProduct);
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

// Perbaikan untuk updateBarang function
export const updateBarang = async (
  id: number,
  updatedBarang: {
    produk: string;
    kodegrp: string;
    kategori_id: number;
    status: string;
    production_date: string;
    user_id: number;
  }
) => {
  try {
    console.log("Sending data:", updatedBarang);
    console.log("To endpoint:", `/api/v1/barang/${id}`);

    const response = await axiosInstance.patch(
      `/api/v1/barang/${id}`,
      updatedBarang,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating barang:", error);
    // Log error response untuk debugging

    throw error;
  }
};

export const deleteBarang = async (id: number) => {
  await axiosInstance.delete(`/api/v1/barang/${id}`);
};
