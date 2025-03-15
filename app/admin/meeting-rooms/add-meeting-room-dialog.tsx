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

export function AddMeetingRoomDialog({ onSuccess }: { onSuccess: () => void }) {
  // State to manage the form inputs
  const [newMeeetingRoom, setNewMeeetingRoom] = useState<{ name: string }>({
    name: "",
  });

  // State to manage dialog visibility
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // State for validation error message
  const [error, setError] = useState<string>("");

  // Handle changes to the input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMeeetingRoom((prevMeetingRoom) => ({
      ...prevMeetingRoom,
      [name]: value, // Dynamically update the state field
    }));
  };

  // Handle form submission
  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validation: Check if fields are empty
    if (!newMeeetingRoom.name) {
      setError("Name is required.");
      return; // Exit the function if validation fails
    }

    await fetch("/api/meetingrooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMeeetingRoom),
    });
    onSuccess();
    setNewMeeetingRoom({ name: "" }); // Clear input fields after successful submission
    setError("");
    setIsOpen(false);
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
          <form onSubmit={handleAddUser} className="flex flex-col gap-3">
            <div>
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name" // Bind input field to the "name" state
                value={newMeeetingRoom.name} // Controlled input
                onChange={handleChange} // Handle input changes
              />
            </div>
            {/* Display error message if validation fails */}
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <DialogFooter>
              <Button type="submit">Add Meeting Room</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
