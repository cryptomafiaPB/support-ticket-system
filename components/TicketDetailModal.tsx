/* eslint-disable @typescript-eslint/no-unused-vars */
// /app/components/TicketDetailModal.tsx
"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { firestore } from "@/firebase/firebaseClient";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Button } from "./ui/button";

interface TicketDetailModalProps {
  isOpen: boolean;
  closeModal: () => void;
  ticket: {
    id: string;
    title: string;
    description: string;
    priority: string;
    category: string;
    status: string;
    assignedTo: string | null;
  };
}

export default function TicketDetailModal({
  isOpen,
  closeModal,
  ticket,
}: TicketDetailModalProps) {
  const [status, setStatus] = useState(ticket.status);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || "");

  const handleSaveChanges = async () => {
    try {
      await updateDoc(doc(firestore, "tickets", ticket.id), {
        status,
        assignedTo,
      });
      toast.success("Ticket updated successfully!");
      closeModal();
    } catch (error) {
      toast.error("Error updating ticket.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Ticket Details
          </Dialog.Title>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={ticket.title}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={ticket.description}
              disabled
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Priority</label>
            <input
              type="text"
              value={ticket.priority}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={ticket.category}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Assigned To
            </label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={closeModal} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState } from "react";
// import { Dialog } from "@headlessui/react";
// import { firestore } from "@/firebase/firebaseClient";
// import { doc, updateDoc } from "firebase/firestore";
// import { toast } from "react-hot-toast";
// import { Button } from "@/components/ui/button";

// interface TicketDetailModalProps {
//   isOpen: boolean;
//   closeModal: () => void;
//   ticket: {
//     id: string;
//     title: string;
//     description: string;
//     priority: string;
//     category: string;
//     status: string;
//     assignedTo: string | null;
//   };
// }

// const TicketDetailModal = ({
//   isOpen,
//   closeModal,
//   ticket,
// }: TicketDetailModalProps) => {
//   const [status, setStatus] = useState(ticket.status);
//   const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || "");

//   const handleSaveChanges = async () => {
//     try {
//       await updateDoc(doc(firestore, "tickets", ticket.id), {
//         status,
//         assignedTo,
//       });
//       toast.success("Ticket updated successfully!");
//       closeModal(); // Close modal after saving
//     } catch (error) {
//       toast.error("Error updating ticket.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onClose={closeModal}>
//       <Dialog.Panel className="w-96 p-6 bg-white rounded-lg shadow-lg">
//         <Dialog.Title className="text-xl font-semibold mb-4">
//           Ticket Details
//         </Dialog.Title>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Title</label>
//           <input
//             type="text"
//             value={ticket.title}
//             disabled
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Description</label>
//           <textarea
//             value={ticket.description}
//             disabled
//             className="w-full p-2 border rounded"
//             rows={4}
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Priority</label>
//           <input
//             type="text"
//             value={ticket.priority}
//             disabled
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Category</label>
//           <input
//             type="text"
//             value={ticket.category}
//             disabled
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Status</label>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="w-full p-2 border rounded"
//           >
//             <option value="Open">Open</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Resolved">Resolved</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Assigned To</label>
//           <input
//             type="text"
//             value={assignedTo}
//             onChange={(e) => setAssignedTo(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div className="flex justify-end gap-2">
//           <Button onClick={closeModal} variant="outline">
//             Cancel
//           </Button>
//           <Button onClick={handleSaveChanges}>Save Changes</Button>
//         </div>
//       </Dialog.Panel>
//     </Dialog>
//   );
// };

// export default TicketDetailModal;
