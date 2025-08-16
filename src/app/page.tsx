"use client";

import Image from "next/image";

import {
  Warehouse,
  ArrowRight,
  Store,
  Rocket,
  Boxes,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/ui/footer";
import Cookies from "js-cookie";
import { useUser } from "@/context/UserContext";

const datas = [
  {
    id: "1",
    icon: Store,
    title: "Manajemen Data Gudang",
    description:
      "Mengelola informasi setiap gudang, termasuk nama, lokasi, kapasitas, dan detail lainnya.",
  },
  {
    id: "2",
    icon: Boxes,
    title: "Manajemen Data Barang",
    description:
      "Mencatat dan memperbarui detail setiap barang, seperti kode, nama, kategori, dan stok awal.",
  },
  {
    id: "3",
    icon: TrendingUp,
    title: "Manajemen Barang Masuk",
    description:
      "Mencatat setiap transaksi penerimaan barang dari pemasok atau gudang lain, lengkap dengan tanggal, jumlah, dan sumber barang.",
  },
  {
    id: "4",
    icon: TrendingDown,
    title: "Manajemen Barang Keluar",
    description:
      "Mencatat pengeluaran barang ke pelanggan, produksi, atau gudang lain, dengan detail jumlah, tujuan, dan waktu pengiriman.",
  },
];

export default function Home() {
  const token = Cookies.get("token");
  console.log(token);
  const { user, loading } = useUser();

  return (
    <>
      <header>
        <nav className="bg-background flex justify-between items-center px-6 py-4 shadow-custom">
          <div className="flex items-center">
            <div className="p-2 bg-primary rounded-sm text-white mr-2">
              <Warehouse className="w-6 h-6" />
            </div>
            <div className="text-text font-semibold text-2xl">
              Warehouse Management
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center bg-primary px-6 py-2.5 font-medium text-base text-white rounded-sm shadow-md hover:bg-primary/90 transition-colors duration-200 ease-in-out"
          >
            <ArrowRight className="mr-2" />
            Get Started
          </Link>
        </nav>
      </header>

      <span className="inline-block absolute left-3/5 top-12 -z-10 bg-gradient-to-br bg-slate-600 to-slate-500 w-16 h-16 rounded-full animate-pulse"></span>

      <span className="inline-block absolute left-9 top-2/6 -z-10 bg-gradient-to-br bg-slate-600 to-slate-500 w-26 h-26 rounded-full animate-pulse"></span>

      <span className="inline-block absolute right-1 top-1/2 -z-10 bg-gradient-to-br bg-slate-600 to-slate-500 w-44 h-44 rounded-full animate-pulse"></span>

      <span className="inline-block absolute left-2/6 -bottom-27 -z-10 bg-gradient-to-br bg-slate-600 to-slate-500 w-12 h-12 rounded-full animate-pulse"></span>

      <div className="flex flex-col items-center justify-center my-16 animate-fade-in">
        <h1 className="font-bold text-4xl text-secondary mb-4">
          Warehouse Management
        </h1>
        <h2 className="text-primary font-bold text-5xl">Warehouse App</h2>
      </div>

      <div className="bg-gradient-to-br from-slate-400 to-slate-500 my-16 mx-18 rounded-2xl p-6 shadow-card animate-fade-in">
        <div className="flex justify-between">
          <div className="relative top-5 left-7 w-full max-w-md mx-auto">
            <Image
              src="/3d.png"
              alt="3D"
              width={452}
              height={452}
              className="relative z-10 mantul w-full h-auto"
            />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 -top-3 w-full max-w-md">
              <svg
                viewBox="0 0 465 463"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
              >
                <path
                  d="M341.176 42.576C388.6 69.632 431.768 109.456 451.528 159.92C471.288 210.08 467.64 270.272 450.008 326.512C432.376 382.752 400.76 434.736 355.16 453.584C309.56 472.432 250.28 458.144 198.6 447.808C146.616 437.472 102.232 431.392 69.096 408.592C35.96 385.488 14.072 346.272 5.256 305.536C-3.256 265.104 1.912 223.76 8.6 176.336C15.288 129.216 23.496 76.32 54.2 43.792C84.904 11.568 138.104 -0.288011 190.392 0.927989C242.376 1.83999 294.056 15.52 341.176 42.576Z"
                  fill="#2563EB"
                />
              </svg>
            </span>
          </div>

          <div className="flex items-center flex-col ml-40 mr-10">
            <h1 className="font-bold text-3xl text-center text-text">
              Solusi Untuk Manajemen Operasi Gudang Anda
            </h1>
            {/* 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-5">
              {datas.map((data, idx) => {
                const Icon = data.icon;
                return (
                  <div
                    className=" border-2 border-slate-800 rounded-sm p-5 shadow-custom-2 relative w-full max-w-sm mx-auto"
                    key={idx}
                  >
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-text text-white px-3 py-1.5 rounded-full font-medium text-xs">
                      {data.id}
                    </span>
                    <div className="flex flex-col items-center mt-1">
                      <div className="bg-background/25 flex justify-center p-1.5 rounded-full text-text">
                        <Icon />
                      </div>
                      <h1 className="mt-1.5 items-center font-medium text-sm text-text">
                        {data.title}
                      </h1>
                      <p className="text-center text-xs text-white mt-2">
                        {data.description}{" "}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {loading ? (
              <div className="py-5 w-full text-center text-white">
                Loading...
              </div>
            ) : user ? (
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center justify-center bg-accent rounded-lg py-5 w-full font-bold text-2xl text-white shadow-custom-3 hover:bg-accent/80 hover:scale-105 focus:scale-100 active:scale-95 active:bg-accent transition-all duration-300 ease-in-out"
              >
                <Rocket className="mr-2" />
                Lanjut Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center bg-primary rounded-lg py-5 w-full font-bold text-2xl text-white shadow-custom-3 hover:bg-primary/80 hover:scale-105 focus:scale-100 active:scale-95 active:bg-primary transition-all duration-300 ease-in-out"
              >
                <Rocket className="mr-2" />
                Login Sekarang
              </Link>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
