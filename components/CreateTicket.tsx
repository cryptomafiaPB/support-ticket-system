"use client";

import { useState } from "react";
import { firestore, storage } from "@/firebase/firebaseClient"; // Ensure Firebase is set up
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext"; // Get user info
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";

interface CreateTicketProps {
  onSuccess?: () => void;
}

export default function CreateTicket({ onSuccess }: CreateTicketProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    date: "",
    category: "Technical",
    email: user?.email || "",
    phone: "",
    termsAgreed: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.email ||
      !formData.date ||
      !formData.phone ||
      !formData.termsAgreed
    ) {
      toast.error("Please fill all required fields and agree to the terms.");
      return;
    }

    setLoading(true);
    let fileURL = "";

    if (file) {
      const storageRef = ref(storage, `attachments/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      fileURL = await getDownloadURL(storageRef);
    }

    const ticketData = {
      ...formData,
      attachment: fileURL,
      createdBy: user?.email,
      status: "Open",
      assignedTo: null,
      createdAt: Timestamp.now(),
    };

    try {
      await addDoc(collection(firestore, "tickets"), ticketData);
      toast.success("Ticket created successfully!");
      setFormData({
        title: "",
        description: "",
        priority: "Low",
        date: "",
        category: "Technical",
        email: user?.email || "",
        phone: "",
        termsAgreed: false,
      });
      setFile(null);
      onSuccess?.(); // Call success callback after successful submission
    } catch (error) {
      toast.error("Error creating ticket.");
      console.error("Error adding ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-lg shadow-md space-y-4"
    >
      {/* <h2 className="text-xl font-bold">Create Support Ticket</h2> */}
      <Input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Ticket Title"
        required
      />
      <Textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe your issue"
        required
      />
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="Technical">Technical</option>
        <option value="Billing">Billing</option>
        <option value="Other">Other</option>
      </select>
      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Your Email"
        required
      />
      <Input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
      />
      <Input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      <Input type="file" onChange={handleFileChange} />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="termsAgreed"
          checked={formData.termsAgreed}
          onChange={handleChange}
          required
        />
        <span>I agree to the terms and conditions</span>
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Ticket"}
      </Button>
    </form>
  );
}
