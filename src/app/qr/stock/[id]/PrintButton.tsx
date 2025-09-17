"use client";

import { QrCode } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
      <QrCode className="w-4 h-4" />
      Print Detail
    </button>
  );
}
