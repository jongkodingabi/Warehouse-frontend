"use client";

import React from "react";
import SidebarAdminGudang from "@/components/ui/sidebarAdminGudang";
import HeaderAdminGudang from "@/components/ui/headerAdminGudang";

// Import StockBarChart secara dynamic dengan no SSR


export default function Layout({
  children,

}: {
  children: React.ReactNode;

}) {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-slate-50 md:flex-row">
        {/* Sidebar */}
        <SidebarAdminGudang />

        <div className="flex flex-1 flex-col">
          <HeaderAdminGudang />
          {/* Main content area */}
          {children}
         
        </div>
      </div>
    </>
  );
}
