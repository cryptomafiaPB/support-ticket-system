// For agent
import TicketTable from "@/components/TicketTable";

export default function AllTicketsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">All Support Tickets</h1>
      <TicketTable isAgent={true} />
    </div>
  );
}

// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function AllTicketsPage() {
//   const { user, role, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && (!user || role !== "agent")) {
//       router.push("/dashboard");
//     }
//   }, [user, role, loading, router]);

//   return role === "agent" ? (
//     <p>All Tickets Page (Coming Soon)</p>
//   ) : (
//     <p>Loading...</p>
//   );
// }
