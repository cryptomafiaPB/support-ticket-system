// /app/dashboard/layout.tsx
"use client";

import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <main className="sm:ml-64 p-6 w-full">{children}</main>
    </div>
  );
}
