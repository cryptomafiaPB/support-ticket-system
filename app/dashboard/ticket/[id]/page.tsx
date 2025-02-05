"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseClient";
import { Ticket } from "@/types/ticket";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function TicketDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { role, user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    async function fetchTicket() {
      try {
        const docRef = doc(firestore, "tickets", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Ticket;
          setTicket({ id: docSnap.id, ...data });
          setStatus(data.status);
          setAssignedTo(data.assignedTo || "");
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
      setLoading(false);
    }
    fetchTicket();
  }, [id]);

  if (loading) return <div>Loading ticket details...</div>;
  if (!ticket) return <div>Ticket not found.</div>;

  // Update ticket data (for agents)
  const handleUpdate = async () => {
    try {
      await updateDoc(doc(firestore, "tickets", id), {
        status,
        assignedTo,
      });
      setEditMode(false);
      alert("Ticket updated successfully.");
      // Optionally, refresh the ticket details.
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Error updating ticket.");
    }
  };

  // Delete ticket (for customers)
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this ticket?")) {
      try {
        await deleteDoc(doc(firestore, "tickets", id));
        alert("Ticket deleted successfully.");
        router.push("/dashboard");
      } catch (error) {
        console.error("Error deleting ticket:", error);
        alert("Error deleting ticket.");
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-500 hover:underline"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-bold mb-4">Ticket Details</h1>
        <div className="border p-4 rounded space-y-2">
          <p>
            <strong>ID:</strong> {ticket.id}
          </p>
          <p>
            <strong>Title:</strong> {ticket.title}
          </p>
          <p>
            <strong>Description:</strong> {ticket.description}
          </p>
          <p>
            <strong>Priority:</strong> {ticket.priority}
          </p>
          <p>
            <strong>Category:</strong> {ticket.category}
          </p>
          <p>
            <strong>Status:</strong> {ticket.status}
          </p>
          <p>
            <strong>Created By:</strong> {ticket.createdBy}
          </p>
          <p>
            <strong>Assigned To:</strong>{" "}
            {ticket.assignedTo ? ticket.assignedTo : "Unassigned"}
          </p>
          <p>
            <strong>Contact Email:</strong> {ticket.contactEmail}
          </p>
          <p>
            <strong>Phone:</strong> {ticket.phone}
          </p>
          <p>
            <strong>Date:</strong> {ticket.date}
          </p>
          {/* Display additional fields as necessary */}
        </div>

        {role === "agent" && (
          <div className="mt-4">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editMode ? "Cancel Edit" : "Edit Ticket"}
            </button>
            {editMode && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block font-medium">Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border p-2"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium">Assign To:</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full border p-2"
                    placeholder="Enter agent identifier"
                  />
                </div>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}

        {role === "customer" && ticket.createdBy === user?.uid && (
          <div className="mt-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Ticket
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
