import { Eye, SquarePen, Trash } from "lucide-react";
import Link from "next/link";

const datas = [
  {
    kodeGudang: "wh-001",
    namaGudang: "Gudang Utama Jakarta",
    lokasiGudang: "Jakarta Selatan",
    kapasitasGudang: "10.000",
    kapasitasTerisi: "8.500",
    persentaseTerisi: "85%",
    status: "Aktif",
  },
  {
    kodeGudang: "wh-002",
    namaGudang: "Gudang Utama Bandung",
    lokasiGudang: "Bandung Barat",
    kapasitasGudang: "9.000",
    kapasitasTerisi: "8.000",
    persentaseTerisi: "88%",
    status: "Aktif",
  },
  {
    kodeGudang: "wh-003",
    namaGudang: "Gudang Utama Surabaya",
    lokasiGudang: "Surabaya",
    kapasitasGudang: "5.000",
    kapasitasTerisi: "3.000",
    persentaseTerisi: "60%",
    status: "Aktif",
  },
  {
    kodeGudang: "wh-004",
    namaGudang: "Gudang Utama Semarang",
    lokasiGudang: "Semarang",
    kapasitasGudang: "8.000",
    kapasitasTerisi: "6.000",
    persentaseTerisi: "75%",
    status: "Aktif",
  },
  {
    kodeGudang: "wh-005",
    namaGudang: "Gudang Utama Bogor",
    lokasiGudang: "Bogor",
    kapasitasGudang: "7.000",
    kapasitasTerisi: "2.000",
    persentaseTerisi: "28%",
    status: "Aktif",
  },
];

export default function GudangTable() {
  return (
    <>
      <div className="bg-background border border-secondary rounded-lg mx-2 sm:mx-6 mb-6">
        <h2 className="font-medium text-text text-2xl px-4 sm:px-6 py-6">
          Data Gudang
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-text/15">
              <tr>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  KODE GUDANG
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  NAMA GUDANG
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  LOKASI GUDANG
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  KAPASITAS GUDANG
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  KAPASITAS TERISI
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  PERSENTASE TERISI
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  STATUS
                </th>
                <th className="px-4 sm:px-6 py-4 font-bold text-xs text-secondary whitespace-nowrap">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody>
              {datas.map((data, idx) => (
                <tr
                  key={idx}
                  className="bg-background text-sm font-medium text-text text-center border-y border-secondary"
                >
                  <td className="px-4 sm:px-6 py-4 uppercase whitespace-nowrap">
                    {data.kodeGudang}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.namaGudang}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.lokasiGudang}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.kapasitasGudang}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.kapasitasTerisi}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {data.persentaseTerisi}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="bg-secondary/25 px-4 py-2 rounded-sm">
                      {data.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 flex gap-2.5 justify-center">
                    <Link href="/detail-gudang" className="">
                      <Eye />
                    </Link>
                    <Link href="/edit-gudang" className="">
                      <SquarePen />
                    </Link>
                    <Link href="/delete-gudang" className="">
                      <Trash />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 gap-3">
          <div>
            <h3 className="text-sm sm:text-base">
              Menampilkan 1-5 dari 10 gudang
            </h3>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm text-secondary">
              Previous
            </button>
            <span className="px-3 sm:px-4 py-2 bg-text text-background rounded-sm font-medium text-sm glow-box">
              1
            </span>
            <span className="px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm">
              2
            </span>
            <span className="px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm">
              3
            </span>
            <button className="px-3 sm:px-4 py-2 border border-secondary rounded-sm font-medium text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
