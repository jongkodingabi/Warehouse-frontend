import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import React from "react";

export const metadata = {
  title: "Gudang",
  description: "Admin Gudang Management",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex flex-col min-h-screen bg-slate-50 md:flex-row">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          {children}
        </div>
      </main>
    </>
  );
}
