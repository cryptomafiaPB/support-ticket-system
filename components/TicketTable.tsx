/* eslint-disable @typescript-eslint/no-unused-vars */
// /app/components/TicketTable.tsx
"use client";

import { useEffect, useState } from "react";
import { firestore } from "@/firebase/firebaseClient";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";
import TicketDetailModal from "./TicketDetailModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface TicketTableProps {
  isAgent: boolean;
  key?: number; // Add key prop
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  status: string;
  createdBy: string;
  assignedTo: string | null;
}

interface Agent {
  uid: string;
  email: string;
  role: string;
}

export default function TicketTable({ isAgent }: { isAgent: boolean }) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(firestore, "tickets"));
      const ticketData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Ticket)
      );
      setTickets(
        isAgent
          ? ticketData
          : ticketData.filter((ticket) => ticket.createdBy === user?.email)
      );
      setLoading(false);
    };

    const fetchAgents = async () => {
      const querySnapshot = await getDocs(collection(firestore, "users"));
      const agentData = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            uid: doc.id,
            email: data.email || "",
            role: data.role || "",
          };
        })
        .filter((u) => u.role === "agent");
      setAgents(agentData);
    };

    fetchTickets();
    if (isAgent) fetchAgents();
  }, [user, isAgent]);

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await deleteDoc(doc(firestore, "tickets", ticketId));
      setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
      toast.success("Ticket deleted successfully!");
    } catch (error) {
      toast.error("Error deleting ticket.");
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await updateDoc(doc(firestore, "tickets", ticketId), {
        status: newStatus,
      });
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
      toast.success("Ticket status updated!");
    } catch (error) {
      toast.error("Error updating ticket status.");
    }
  };

  const handleAssign = async (ticketId: string, assignedTo: string) => {
    try {
      await updateDoc(doc(firestore, "tickets", ticketId), { assignedTo });
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, assignedTo } : t))
      );
      toast.success("Ticket assigned successfully!");
    } catch (error) {
      toast.error("Error assigning ticket.");
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Tickets</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead>Status</TableHead>
              {isAgent && <TableHead>Assigned To</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {ticket.category}
                </TableCell>
                <TableCell>
                  {isAgent ? (
                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        handleStatusChange(ticket.id, e.target.value)
                      }
                      className="p-1 border rounded"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  ) : (
                    ticket.status
                  )}
                </TableCell>
                {isAgent && (
                  <TableCell>
                    <select
                      value={ticket.assignedTo || ""}
                      onChange={(e) => handleAssign(ticket.id, e.target.value)}
                      className="p-1 border rounded"
                    >
                      <option value="">Unassigned</option>
                      {agents.map((agent) => (
                        <option key={agent.uid} value={agent.email}>
                          {agent.email}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                )}
                <TableCell className="space-x-2 space-y-2">
                  <Button
                    onClick={() => handleViewTicket(ticket)}
                    className="bg-blue-500"
                  >
                    View/Edit
                  </Button>
                  {!isAgent && (
                    <Button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="bg-red-500"
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedTicket && (
        <TicketDetailModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          ticket={selectedTicket}
        />
      )}
    </div>
  );
}
