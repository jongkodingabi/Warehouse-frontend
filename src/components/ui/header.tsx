import Image from "next/image";
import Logo from "../../../public/assets/logo.png";
import Person from "../../../public/assets/person.png";
import { Bell } from "lucide-react";
export default function Header() {
  // const { data: any } = user();
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
        <Bell className="w-6 h-6 text-gray-600" />
        <Image
          src={Person}
          alt="Avatar"
          height={32}
          width={32}
          className="w-8 h-8 rounded-full object-contain"
        />
        <span className="text-sm font-medium text-gray-700">Jhon Doe</span>
      </div>
    </header>
  );
}
