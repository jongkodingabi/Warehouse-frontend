import { BoxesIcon, TrendingUp, TrendingDown } from "lucide-react";

export default function Stock() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-50 px-5">
      {/* Card 1 */}
      <div className="bg-white rounded-lg shadow border p-4 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="bg-primary text-white p-2 rounded-md">
            <BoxesIcon className="w-8 h-8" />
          </div>
          <span className="bg-primary text-white text-md font-semibold px-2 py-1 rounded">
            12 %
          </span>
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-semibold">1.246</p>
          <p className="text-sm text-gray-500">Total Barang</p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-lg shadow border p-4 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="bg-primary text-white p-2 rounded-md">
            <TrendingUp className="w-8 h-8" />
          </div>
          <span className="bg-primary text-white text-md font-semibold px-2 py-1 rounded">
            18 %
          </span>
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-semibold">80</p>
          <p className="text-sm text-gray-500">Barang Masuk</p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-lg shadow border p-4 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="bg-primary text-white p-2 rounded-md">
            <TrendingDown className="w-8 h-8" />
          </div>
          <span className="bg-primary text-white text-md font-semibold px-2 py-1 rounded">
            21 %
          </span>
        </div>
        <div className="mt-auto">
          <p className="text-2xl font-semibold">90</p>
          <p className="text-sm text-gray-500">Barang Keluar</p>
        </div>
      </div>
    </div>
  );
}
