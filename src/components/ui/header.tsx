"use client";

import Image from "next/image";
import Logo from "../../../public/assets/logo.png";
import Person from "../../../public/assets/person.png";
import { Bell } from "lucide-react";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
export default function Header() {
  // const { data: any } = user();

  const { user } = useUser();
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-30">
      {/* Logo */}
      <div className="flex space-x-2 text-xl font-semibold text-gray-800">
        <Image
          src={Logo}
          height={50}
          width={50}
          alt="logo"
          className="w-8 mr-1.5"
        />
        Warehouse Management
      </div>

      {/* Profil */}
      <div className="flex items-center gap-3">
        <button className="relative ">
          <Bell className="w-8 h-8 text-gray-600 cursor-pointer hover:text-gray-500 transition-colors duration-200 ease-in-out" />
          <span className="absolute -top-2 -right-2 text-white bg-secondary rounded-full px-2 py-0.5 text-xs font-bold shadow-md">
            0
          </span>
        </button>
        <Link href="/admin/profile" className="flex space-x-2">
          <Image
            src={Person}
            alt="Avatar"
            height={32}
            width={32}
            className="w-8 h-8 rounded-full object-contain"
          />
          <span className="text-sm font-medium text-gray-700 mt-2">
            {user?.name ?? "Guset"}
          </span>
        </Link>
      </div>
    </header>
  );
}
