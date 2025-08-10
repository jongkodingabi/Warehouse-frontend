// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      {/* Icon / Illustration */}
      <div className="mb-6 flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-32 w-32 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h18M4 21h16a1 1 0 001-1V8.5a1 1 0 00-.293-.707l-6.5-6.5A1 1 0 0013.5 1H4a1 1 0 00-1 1v18a1 1 0 001 1z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 11h8m-8 4h5"
          />
        </svg>
      </div>

      {/* Text */}
      <h1 className="text-4xl font-bold text-blue-700 mb-2">Page Not Found</h1>
      <p className="text-gray-600 text-center max-w-md">
        Waduh, halaman yang kamu cari nggak ketemu nih. Coba cek lagi alamatnya,
        atau balik ke halaman sebelumnya, ya!
      </p>

      {/* Button */}
      {/* <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.history.back();
        }}
        className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-medium shadow-md hover:bg-blue-700 transition"
      >
        Kembali
      </Link> */}
    </div>
  );
}
