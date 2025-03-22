"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AddMeetingRoomDialog({ onSuccess }: { onSuccess: () => void }) {
  // State to manage the form inputs
  const [newMeetingRoom, setNewMeetingRoom] = useState<{ name: string }>({
    name: "",
  });

  // State to manage dialog visibility
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // State for validation error message
  const [error, setError] = useState<string>("");

  // Handle changes to the input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMeetingRoom((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleAddMeetingRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validation: Check if fields are empty
    if (!newMeetingRoom.name.trim()) {
      setError("Meeting room name is required.");
      return;
    }

    try {
      const response = await fetch("/api/meetingrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeetingRoom),
      });

      const result = await response.json(); // Parse JSON response

      if (!response.ok) {
        throw new Error(result.message || "Failed to add meeting room"); // Throw error if API fails
      }

      setNewMeetingRoom({ name: "" }); // Clear input fields
      setError("");
      setIsOpen(false);
      toast.success("Meeting Room created successfully!");
      onSuccess(); // Trigger re-fetch
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!"); // Show error toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Meeting Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Meeting Room</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <form onSubmit={handleAddMeetingRoom} className="flex flex-col gap-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newMeetingRoom.name}
                onChange={handleChange}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit">Add Meeting Room</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
