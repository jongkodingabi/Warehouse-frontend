"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import {
  LogOut,
  ClipboardList,
  Menu,
  HomeIcon,
  Box,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Scroll,
  Users,
} from "lucide-react";
import Cookies from "js-cookie";

import { ChartLine } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { NextResponse } from "next/server";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [isStockDropdownOpen, setStockDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/logout");
      const token = response.data.token;
      Cookies.remove("token", token);
      console.log(token);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg border border-gray-300"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6 text-gray-800" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-40 md:z-20 top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 text-gray-800 flex flex-col pt-16 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-auto">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === "/admin/dashboard"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChartLine className="w-5 h-5" />
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                href="/admin/gudang"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === "/admin/gudang"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                Gudang
              </Link>
            </li>

            <li>
              <Link
                href="/admin/categories"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === "/admin/categories"
                    ? "bg-gray-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                Data Barang
              </Link>
            </li>

            {/* Dropdown Stock Barang */}
            <li>
              <button
                onClick={() => setStockDropdownOpen(!isStockDropdownOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg ${
                  pathname.includes("/admin/stock")
                    ? "bg-gray-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Box className="w-5 h-5" />
                  Stock Barang
                </div>
                {isStockDropdownOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {isStockDropdownOpen && (
                <ul className="ml-8 mt-1 space-y-1">
                  <li>
                    <Link
                      href="/admin/stock/data"
                      className={`block px-3 py-2 text-sm rounded-lg ${
                        pathname === "/admin/stock/data"
                          ? "bg-gray-100 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <TrendingUp className="inline w-4 h-4 mr-2" />
                      Stock Masuk
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/stock/history"
                      className={`block px-3 py-2 text-sm rounded-lg ${
                        pathname === "/admin/stock/history"
                          ? "bg-gray-100 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <TrendingDown className="inline w-4 h-4 mr-2" />
                      Stock Keluar
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/admin/users"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === "/admin/users"
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Users className="w-5 h-5" />
                Admin Gudang
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === "/admin/users"
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Scroll className="w-5 h-5" />
                Audit Log
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Spacer (desktop) */}
      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
}
