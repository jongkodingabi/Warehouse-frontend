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

      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 md:flex-row">
        {/* Sidebar */}
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Header />
          {/* Main content area */}
          {children}
          {/* Stock components */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow p-4">{stock}</div>
              <div className="bg-white rounded-lg shadow p-4">
                {stockBarChart}
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                {stockPieChart}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
