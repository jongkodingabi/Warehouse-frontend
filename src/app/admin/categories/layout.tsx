import React from "react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export const metadata = {
  title: "Category",
  description: "Admin Gudang Management",
};

export default function Layout({
  children,
}: // table,
// card,
// filter,
{
  // table: React.ReactNode;
  children: React.ReactNode;
  // card: React.ReactNode;
  // filter: React.ReactNode;
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
          {/* {card} */}
          {/* Filter Data */}
          {/* {filter} */}
          {/* Gudang Table */}
          {/* {table} */}
          <Footer />
        </div>
      </div>
    </>
  );
}
