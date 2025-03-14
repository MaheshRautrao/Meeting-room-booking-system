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

export function AddUserDialog({ onSuccess }) {
  // State to manage the form inputs
  const [newUser, setNewUser] = useState({ name: "", employeeCode: "" });

  // State to manage dialog visibility
  const [isOpen, setIsOpen] = useState(false);

  // State for validation error message
  const [error, setError] = useState("");

  // Handle changes to the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value, // Dynamically update the state field
    }));
  };

  // Handle form submission
  const handleAddUser = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validation: Check if fields are empty
    if (!newUser.name || !newUser.employeeCode) {
      setError("Both fields are required.");
      return; // Exit the function if validation fails
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    setNewUser({ name: "", employeeCode: "" }); // Clear input fields after successful submission
    setError("");
    setIsOpen(false);
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
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
                value={newUser.name} // Controlled input
                onChange={handleChange} // Handle input changes
              />
            </div>
            <div>
              <Label htmlFor="employeeCode" className="text-right">
                Employee Code
              </Label>
              <Input
                id="employeeCode"
                name="employeeCode" // Bind input field to the "employeeCode" state
                value={newUser.employeeCode} // Controlled input
                onChange={handleChange} // Handle input changes
              />
            </div>

            {/* Display error message if validation fails */}
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <DialogFooter>
              <Button type="submit">Add User</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
