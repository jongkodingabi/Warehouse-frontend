"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

const data = [
  {
    nama: "Kaos Polos Hitam Lengan Panjang",
    total: 261,
    tipe: "Barang Masuk",
  },
  {
    nama: "Kaos Polos Hitam Lengan Panjang",
    total: 261,
    tipe: "Barang Masuk",
  },
  {
    nama: "Kaos Polos Hitam Lengan Panjang",
    total: 261,
    tipe: "Barang Masuk",
  },
];

export default function AuditLogTable() {
  const [auditData, setAuditData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAuditData = async () => {
    const response = await axiosInstance.get("/api/v1/auditlog");
    setAuditData(response.data);
  };

  useEffect(() => {});
  return (
    <div className="border rounded-lg p-4 mx-4 mb-4 bg-white shadow-md">
      <h2 className="text-lg font-semibold mb-4">Audit Log</h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm text-left border-collapse rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-3 font-medium">Nama Barang</th>
              <th className="px-4 py-3 font-medium text-center">
                Total Barang
              </th>
              <th className="px-4 py-3 font-medium text-center">Tipe</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2 text-center font-bold">
                  {item.total}
                </td>
                <td className="px-4 py-2 text-center">{item.tipe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
