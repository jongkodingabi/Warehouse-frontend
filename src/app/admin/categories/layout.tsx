import React from "react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export const metadata = {
  title: "Category",
  description: "Admin Gudang Management",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-50 md:flex-row">
        {/* Sidebar */}
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Header />
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
}
