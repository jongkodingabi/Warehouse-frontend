"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "USA", value: 1 },
  { name: "Denmark", value: 2 },
  { name: "Sweden", value: 3 },
  { name: "Indonesia", value: 4 },
  { name: "Netherland", value: 5 },
];

export default function StockBarChart() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-md border p-4">
      <h2 className="text-xl font-semibold mb-4">Data Barang</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1D4ED8" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
