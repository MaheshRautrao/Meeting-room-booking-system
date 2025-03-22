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

// Regular expression for employee code validation (EMP followed by digits)
const EMPLOYEE_CODE_REGEX = /^EMP\d+$/;

export function AddUserDialog({ onSuccess }: { onSuccess: () => void }) {
  const [newUser, setNewUser] = useState<{
    name: string;
    employeeCode: string;
  }>({
    name: "",
    employeeCode: "",
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    name?: string;
    employeeCode?: string;
  }>({});
  const [loading, setLoading] = useState<boolean>(false); // ✅ Loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors: { name?: string; employeeCode?: string } = {};

    if (!newUser.name.trim()) {
      validationErrors.name = "Name is required.";
    }

    if (!newUser.employeeCode.trim()) {
      validationErrors.employeeCode = "Employee code is required.";
    } else if (!EMPLOYEE_CODE_REGEX.test(newUser.employeeCode)) {
      validationErrors.employeeCode =
        "Invalid format. Employee code should be in format EMP followed by numbers (e.g., EMP123).";
    }

    // If validation fails, update state and stop form submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true); // ✅ Disable button while submitting

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add user");
      }

      setNewUser({ name: "", employeeCode: "" });
      setErrors({});
      setIsOpen(false);
      toast.success("User created successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false); // ✅ Re-enable button after request completes
    }
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
            {/* Name Input */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newUser.name}
                onChange={handleChange}
                disabled={loading} // ✅ Disable input while submitting
              />
              {errors.name && (
                <div className="text-red-500 text-sm">{errors.name}</div>
              )}
            </div>

            {/* Employee Code Input */}
            <div>
              <Label htmlFor="employeeCode">Employee Code</Label>
              <Input
                id="employeeCode"
                name="employeeCode"
                value={newUser.employeeCode}
                onChange={handleChange}
                disabled={loading} // ✅ Disable input while submitting
              />
              {errors.employeeCode && (
                <div className="text-red-500 text-sm">
                  {errors.employeeCode}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
