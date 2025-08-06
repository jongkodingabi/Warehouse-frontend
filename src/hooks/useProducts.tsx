"use client";

import useSWR from "swr";
import axiosInstance from "@/lib/axios";
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export const useProducts = () => {
  const { data, error, isLoading } = useSWR("/api/v1/barang", fetcher, {
    refreshInterval: 3000, // Refresh every 10 seconds
  });

  // console.log(data.data);
  return {
    products: data?.data || {
      message: "No products found",
      data: [
        {
          id: 0,
          nama_barang: "No products available",
          kode_barcode: "N/A",
          gambar: "",
          harga: 0,
        },
      ],
    },
    isLoading,
    isError: error,
  };
};
