import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Target,
  LogOut,
  Home,
  Banknote,
  Folder,
  Menu,
  HomeIcon,
  Box,
  FolderArchive,
} from "lucide-react";

const navigation = [
  { name: "Overview", link: "/admin/dashboard", icon: Home, current: true },
  {
    name: "Barang",
    link: "/admin/transaction",
    current: false,
    icon: Box,
  },
  {
    name: "Categories",
    link: "/admin/categories",
    current: false,
    icon: FolderArchive,
  },
  { name: "Gudang", link: "/admin/goals", icon: HomeIcon, current: false },
  // { name: "Smart", link: "#", icon: Zap, current: false },
];

const bottomNavigation = [
  // { name: "Settings", href: "#", icon: Settings },
  // { name: "Help", href: "#", icon: HelpCircle },
  { name: "Logout", href: "#", icon: LogOut },
];

export default function Sidbar() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-950 p-2 rounded-lg border border-gray-800"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6 text-white" />
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
        className={`
          fixed z-50 top-0 left-0 min-h-screen w-64 bg-gray-950 border-r border-gray-800 text-white flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:flex md:min-h-screen
        `}
      >
        {/* Close button on mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-4">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Super Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.link;

              return (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="px-4 py-4">
          <ul className="space-y-2">
            {bottomNavigation.map((item) => (
              <li key={item.name}>
                {item.name === "Logout" ? (
                  <button
                    type="button"
                    className="w-full flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Spacer for sidebar on desktop */}
      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
}
