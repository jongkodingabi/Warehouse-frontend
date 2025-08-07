"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Nama Barang", value: 18 },
  { name: "Nama Barang", value: 32 },
  { name: "Nama Barang", value: 27 },
  { name: "Nama Barang", value: 23 },
];

const COLORS = ["#3B82F6", "#9CA3AF", "#10B981", "#111827"]; // biru, abu, hijau, hitam gelap

export default function DonutChart() {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-md border p-4">
      <h2 className="text-xl font-semibold mb-4">Most Recently</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            label={({ percent }: any) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
