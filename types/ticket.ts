/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Ticket {
    id?: string; // Firestore document ID
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    category: string;
    status: "Open" | "In Progress" | "Closed";
    createdBy: string;
    assignedTo?: string;
    contactEmail: string;
    phone: string;
    date: string;
    checkbox?: boolean;
    radio?: string;
    // You can include additional fields (e.g., attachment URL) as needed.
    createdAt: any; // typically a Firestore timestamp
}
