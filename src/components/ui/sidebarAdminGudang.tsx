"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { LogOut, Menu, Box, Scroll, Group, WatchIcon } from "lucide-react";
import Cookies from "js-cookie";

import { ChartLine } from "lucide-react";
import axiosInstance from "@/lib/axios";
import LogoutConfirmationModal from "../core/LogoutModal";

export default function SidebarAdminGudang() {
  const [open, setOpen] = useState(false);
  const [isStockDropdownOpen, setStockDropdownOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [logoutModal, setLogoutModal] = useState(false);
  const { setUser } = useUser();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/logout");
      const token = response.data.token;
      Cookies.remove("token", token);
      setUser(null);
      console.log(token);
      router.push("/");
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
                href="/adminGudang/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === "/adminGudang/dashboard"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChartLine className="w-5 h-5" />
                Dashboard
              </Link>
            </li>

            {/* Kategori  */}
            <li>
              <Link
                href="/adminGudang/categories"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === "/adminGudang/categories"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Group className="w-5 h-5" />
                  Kategori & Barang
                </div>
              </Link>
            </li>

            {/* Dropdown Stock Barang */}
            <li>
              <Link
                href="/adminGudang/stock"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === "/adminGudang/stock"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Box className="w-5 h-5" />
                  Stock Barang
                </div>
              </Link>
            </li>

            <li>
              <Link
                href="/adminGudang/audit"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === "/adminGudang/audit"
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Scroll className="w-5 h-5" />
                Audit Log
              </Link>
            </li>

            <li>
              <Link
                href="/admin/aktivitas"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === "/admin/aktifitas"
                    ? "bg-[#2563EB] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <WatchIcon className="w-5 h-5" />
                Log Aktivitas
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Spacer (desktop) */}
      <div className="hidden md:block w-64 flex-shrink-0" />

      {logoutModal && (
        <LogoutConfirmationModal
          onConfirm={handleLogout}
          onClose={() => setLogoutModal(false)}
          isOpen={logoutModal}
        />
      )}
    </>
  );
}
