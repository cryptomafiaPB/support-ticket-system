// /app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";

export default function Sidebar() {
  const { user, role, logout } = useAuth();

  if (!user) return null;

  return (
    <>
      <header className="w-full block sm:hidden">
        <nav className="flex justify-between items-center p-4 bg-gray-800">
          <Link href="/">
            <h1 className="text-xl text-white font-bold">Support System</h1>
          </Link>
          <div className="flex items-center space-x-4">
            {/* <Link
              href="/dashboard"
              className="block px-4 py-2 bg-gray-700 rounded"
            >
              Tickets
            </Link> */}

            <Button className="w-full text-sm bg-red-500" onClick={logout}>
              Logout
            </Button>
          </div>
        </nav>
      </header>
      <aside className="w-64 bg-gray-800 text-white h-screen p-4 fixed hidden sm:block">
        <h2 className="text-xl font-bold">Support System</h2>
        <p className="text-sm text-muted-foreground">{role}</p>
        <nav className="mt-6 space-y-4">
          <Link
            href="/dashboard"
            className="block px-4 py-2 bg-gray-700 rounded"
          >
            Tickets
          </Link>
          {role === "agent" && (
            <Link
              href="/dashboard/all-tickets"
              className="block px-4 py-2 bg-gray-700 rounded"
            >
              All Tickets
            </Link>
          )}
          <Button className="w-full mt-6 bg-red-500" onClick={logout}>
            Logout
          </Button>
        </nav>
      </aside>
    </>
  );
}
