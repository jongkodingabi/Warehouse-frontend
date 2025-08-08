import React from "react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";

export const metadata = {
  title: "Gudang",
  description: "Admin Gudang Management",
};

export default function Layout({
  children,
  gudangTable,
  card,
}: {
  gudangTable: React.ReactNode;
  children: React.ReactNode;
  card: React.ReactNode;
}) {
  return (
    <>
      <>
        <div className="flex flex-col min-h-screen bg-slate-50 md:flex-row">
          {/* Sidebar */}
          <Sidebar />

          <div className="flex flex-1 flex-col">
            <Header />
            {/* Main content area */}
            {children}
            {card}
            {/* Gudang Table */}
            {gudangTable}
          </div>
        </div>
      </>
    </>
  );
}
