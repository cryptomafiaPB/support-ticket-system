// /app/dashboard/all-tickets/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TicketTable from "@/components/TicketTable";

export default function AllTicketsPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || role !== "agent")) {
      router.push("/dashboard");
    }
  }, [user, role, loading, router]);

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Support Tickets</h1>
      <TicketTable isAgent={true} />
    </div>
  );
}
