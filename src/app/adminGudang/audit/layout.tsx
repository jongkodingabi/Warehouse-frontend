import React from "react";
import Footer from "@/components/ui/footer";
import SidebarAdminGudang from "@/components/ui/sidebarAdminGudang";
import HeaderAdminGudang from "@/components/ui/headerAdminGudang";

export const metadata = {
  title: "Barang",
  description: "Admin Gudang Management",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-50 md:flex-row">
        {/* Sidebar */}
        <SidebarAdminGudang />

        <div className="flex flex-1 flex-col">
          <HeaderAdminGudang />
          {/* Main content area */}
          {children}

          <Footer />
        </div>
      </div>
    </>
  );
}
