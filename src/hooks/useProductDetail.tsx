"use client";

import axiosInstance from "@/lib/axios";
import useSWR from "swr";
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export const useProductDetail = (id: string) => {
  const { data, error, isLoading } = useSWR(`/api/v1/barang/${id}`);
  return {
    product: data?.data || null,
    isLoading,
    isError: error,
  };
};
