/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { db, storage } from "@/firebase/firebaseClient"; // Firebase config
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function TicketForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      let attachmentUrl = "";

      if (data.attachment[0]) {
        const fileRef = ref(
          storage,
          `attachments/${Date.now()}_${data.attachment[0].name}`
        );
        await uploadBytes(fileRef, data.attachment[0]);
        attachmentUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, "tickets"), {
        ...data,
        attachment: attachmentUrl,
        status: "Open",
        createdAt: new Date(),
      });

      reset();
      alert("Ticket submitted successfully!");
    } catch (error) {
      console.error("Error submitting ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 space-y-4 bg-white shadow-md rounded-md"
    >
      <Input
        {...register("title", { required: "Title is required" })}
        placeholder="Title"
      />
      {errors.title && (
        <p className="text-red-500">{String(errors.title.message)}</p>
      )}

      <Textarea
        {...register("description", { required: "Description is required" })}
        placeholder="Description"
      />
      {errors.description && (
        <p className="text-red-500">{String(errors.description.message)}</p>
      )}

      <Select {...register("priority", { required: "Priority is required" })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
        </SelectContent>
      </Select>
      {errors.priority && (
        <p className="text-red-500">{String(errors.priority.message)}</p>
      )}

      <Input type="file" {...register("attachment")} />

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Ticket"}
      </Button>
    </form>
  );
}
