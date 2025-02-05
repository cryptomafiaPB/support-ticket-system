/* eslint-disable @typescript-eslint/no-unused-vars */
// /app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TicketTable from "@/components/TicketTable";
import CreateTicket from "@/components/CreateTicket";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function DashboardPage() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0); // Add reload trigger

  const handleTicketCreated = () => {
    setOpen(false); // Close sheet
    setTableKey((prev) => prev + 1); // Force table reload
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
      {/* <button
        onClick={() => setShowCreate(true)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Create Ticket
      </button> */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Create Ticket</Button>
        </SheetTrigger>

        <SheetContent className="sm:max-w-[425px] h-auto scroll-auto">
          <SheetHeader>
            <SheetTitle>Create Ticket</SheetTitle>
            <SheetDescription>
              Fill out the form below to create a new ticket.
            </SheetDescription>
          </SheetHeader>

          <div className="mb-4 ">
            <CreateTicket onSuccess={handleTicketCreated} />
          </div>
        </SheetContent>
      </Sheet>

      <TicketTable key={tableKey} isAgent={role === "agent" ? true : false} />
    </div>
  );
}
