/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/firebase/firebaseClient"; // Firebase config
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext"; // Custom hook to get user info
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import CreateTicket from "@/components/CreateTicket"; // Import form
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Using shadcn/ui for modal

export default function SupportDashboard() {
  const { user, role, loading } = useAuth(); // Get current user and role
  const [tickets, setTickets] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      let q;
      if (role === "customer") {
        q = query(
          collection(firestore, "tickets"),
          where("createdBy", "==", user.email)
        );
      } else {
        q = query(collection(firestore, "tickets"));
      }

      const snapshot = await getDocs(q);
      setTickets(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setDataLoading(false);
    };

    fetchTickets();
  }, [user, role]);

  const updateStatus = async (ticketId: string, newStatus: string) => {
    await updateDoc(doc(firestore, "tickets", ticketId), { status: newStatus });
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Support Dashboard</h2>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Ticket
          </button>
        </DialogTrigger>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              Please fill in all required fields and agree to the terms.
            </DialogDescription>
          </DialogHeader>
          <CreateTicket />
        </DialogContent>
      </Dialog>
      {loading || dataLoading ? (
        <p>Loading tickets...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell>
                  {role === "agent" ? (
                    <select
                      value={ticket.status}
                      onChange={(e) => updateStatus(ticket.id, e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  ) : (
                    ticket.status
                  )}
                </TableCell>
                <TableCell>
                  <Button>View</Button>
                  {role === "customer" && <Button>Delete</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
