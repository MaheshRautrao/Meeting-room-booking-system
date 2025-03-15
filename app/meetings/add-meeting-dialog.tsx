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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DateTimePicker } from "../../components/date-time-picker";
import { CalendarDays } from "lucide-react";
import { MultiSelect } from "@/components/multi-select";
import { MeetingRoom } from "@/datatable/meeting-rooms";
import { User } from "@/datatable/users";

export default function AddMeetingDialog({
  onSuccess,
  users,
  meetingRooms,
}: {
  onSuccess: () => void;
  users: User[]; // Replace 'any[]' with a proper user type if available
  meetingRooms: MeetingRoom[]; // Replace 'any[]' with a proper meeting room type if available
}) {
  // State to manage the form inputs
  const [newMeeting, setNewMeeting] = useState<{
    title: string;
    users: string[];
    startTime: Date | null | undefined;
    endTime: Date | null | undefined;
    meetingroom: string;
  }>({
    title: "",
    users: [],
    startTime: null,
    endTime: null,
    meetingroom: "",
  });

  // State to manage dialog visibility
  const [isOpen, setIsOpen] = useState(false);

  // State for validation error message
  const [error, setError] = useState("");

  // Handle changes to the title fields
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMeeting((prevMeeting) => ({
      ...prevMeeting,
      title: e.target.value,
    }));
  };

  const handleUsersChange = (selectedUsers: string[]) => {
    setNewMeeting((prev) => ({ ...prev, users: selectedUsers }));
  };

  // Handle single-select for meeting rooms
  const handleMeetingRoomChange = (value: string) => {
    setNewMeeting((prevMeeting) => ({
      ...prevMeeting,
      meetingroom: value,
    }));
  };

  const handleStartTimeChange = (date: Date | null | undefined) => {
    if (!date) return; // Ensure we don't set an invalid date
    setNewMeeting((prevMeeting) => ({
      ...prevMeeting,
      startTime: date,
    }));
  };

  const handleEndTimeChange = (date: Date | null | undefined) => {
    if (!date) return; // Ensure we don't set an invalid date
    setNewMeeting((prevMeeting) => ({
      ...prevMeeting,
      endTime: date,
    }));
  };
  // Handle form submission
  const handleAddMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Collect validation errors
    const errors = [];

    // Check if each field is empty
    if (!newMeeting.title) {
      errors.push("Title is required.");
    }

    if (!newMeeting.users || newMeeting.users.length === 0)
      errors.push("At least one user is required.");

    if (!newMeeting.startTime) {
      errors.push("Start Time is required.");
    }

    if (!newMeeting.endTime) {
      errors.push("End Time is required.");
    }

    // Validate that end time is greater than start time
    if (newMeeting.startTime && newMeeting.endTime) {
      if (newMeeting.endTime <= newMeeting.startTime) {
        errors.push("End time must be greater than start time.");
      }
    }

    if (!newMeeting.meetingroom) {
      errors.push("Meeting Room is required.");
    }

    // If there are any errors, set them and return
    if (errors.length > 0) {
      setError(errors.join(", ")); // Combine errors into one message
      return;
    }

    await fetch("/api/meetings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMeeting),
    });

    onSuccess();
    setNewMeeting({
      title: "",
      users: [],
      startTime: null,
      endTime: null,
      meetingroom: "",
    }); // Clear input fields after successful submission
    setError(""); // Reset error message if validation is successful
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Meeting</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Meeting</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <form onSubmit={handleAddMeeting} className="flex flex-col gap-5">
            {/* Title Input */}
            <div className="items-center gap-4">
              <Label htmlFor="title" className="text-right flex h-6">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={newMeeting.title}
                onChange={handleTitleChange}
              />
            </div>

            {/* User Single-Select */}
            {/* <div className="items-center gap-4 ">
              <Label htmlFor="users" className="text-right flex h-6">
                Users
              </Label>
              <Select
                id="users"
                name="users"
                value={newMeeting.user}
                onValueChange={handleUserChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            <div onClick={(e) => e.stopPropagation()}>
              <Label>Users</Label>
              <MultiSelect
                options={users.map((user) => ({
                  label: user.name,
                  value: user.name,
                }))}
                onValueChange={handleUsersChange}
                defaultValue={newMeeting.users}
                placeholder="Select Users"
                maxCount={3}
                modalPopover={true}
              />
            </div>

            {/* Meeting Room Single-Select */}
            <div className="items-center gap-4">
              <Label htmlFor="meetingroom" className="text-right flex h-6">
                Meeting Room
              </Label>
              <Select
                name="meetingroom"
                value={newMeeting.meetingroom}
                onValueChange={handleMeetingRoomChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {meetingRooms.map((room) => (
                    <SelectItem key={room.id} value={room.name}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date Input */}
            <div className="items-center gap-4">
              <Label htmlFor="date" className="flex gap-2 items-center h-10">
                <CalendarDays className="h-4 w-4" />
                <p>Start Date And Time</p>
              </Label>
              <DateTimePicker
                value={newMeeting.startTime}
                onChange={handleStartTimeChange}
              />
            </div>

            {/* End Date Input */}
            <div className="items-center gap-4">
              <Label htmlFor="date" className="flex gap-2 items-center h-10">
                <CalendarDays className="h-4 w-4" />
                <p>End Date And Time</p>
              </Label>
              <DateTimePicker
                value={newMeeting.endTime}
                onChange={handleEndTimeChange}
              />
            </div>
            {/* Display error message if validation fails */}
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <DialogFooter>
              <Button type="submit">Add Meeting</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
