// /app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center mx-8 sm:mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-center">
        Welcome to the Ticket Support System
      </h1>
      <Link
        href="/auth/login"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Login
      </Link>
    </main>
  );
}
