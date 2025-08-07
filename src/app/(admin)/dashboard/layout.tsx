import Head from "next/head";
import React from "react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";

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
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Admin Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-slate-50 md:flex-row">
        {/* Sidebar */}
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Header />
          {/* Main content area */}
          {children}
          {/* Stock components */}
          {stock}
          {stockBarChart}
          {stockPieChart}
        </div>
      </div>
    </>
  );
}
