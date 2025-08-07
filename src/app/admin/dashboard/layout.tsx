import React from "react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";

export const metadata = {
  title: "Dashboard",
  description: "Admin Dashboard",
};

export default function Layout({
  children,
  stock,
  stockBarChart,
  stockPieChart,
}: {
  children: React.ReactNode;
  stock: React.ReactNode;
  stockBarChart: React.ReactNode;
  stockPieChart: React.ReactNode;
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
          {/* Stock components */}
          {stock}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {stockBarChart}
            {stockPieChart}
          </div>
        </div>
      </div>
    </>
  );
}
