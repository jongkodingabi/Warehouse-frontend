import React from "react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export const metadata = {
  title: "Gudang",
  description: "Admin Gudang Management",
};

export default function Layout({
  children,
  gudangTable,
  card,
  filter,
}: {
  gudangTable: React.ReactNode;
  children: React.ReactNode;
  card: React.ReactNode;
  filter: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-50 md:flex-row">
        {/* Sidebar */}
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Header />
          {/* Main content area */}
          {children}
          {/* Card Data */}
          {card}
          {/* Filter Data */}
          {filter}
          {/* Gudang Table */}
          {gudangTable}
          <Footer />
        </div>
      </div>
    </>
  );
}
