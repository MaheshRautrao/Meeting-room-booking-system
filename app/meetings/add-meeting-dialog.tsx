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
import { toast } from "sonner"; // ✅ Import toast for notifications

export default function AddMeetingDialog({
  onSuccess,
  users,
  meetingRooms,
}: {
  onSuccess: () => void;
  users: User[];
  meetingRooms: MeetingRoom[];
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

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleAddMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = [];

    if (!newMeeting.title) errors.push("Title is required.");
    if (!newMeeting.users.length) errors.push("At least one user is required.");
    if (!newMeeting.startTime) errors.push("Start Time is required.");
    if (!newMeeting.endTime) errors.push("End Time is required.");
    if (
      newMeeting.startTime &&
      newMeeting.endTime &&
      newMeeting.endTime <= newMeeting.startTime
    ) {
      errors.push("End time must be greater than start time.");
    }
    if (!newMeeting.meetingroom) errors.push("Meeting Room is required.");

    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeeting),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add meeting");
      }

      setNewMeeting({
        title: "",
        users: [],
        startTime: null,
        endTime: null,
        meetingroom: "",
      });

      setError("");
      setIsOpen(false);
      toast.success("Meeting created successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
    }
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
            <div className="items-center gap-4">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={newMeeting.title}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, title: e.target.value })
                }
              />
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <Label>Users</Label>
              <MultiSelect
                options={users.map((user) => ({
                  label: user.name,
                  value: user.name,
                }))}
                onValueChange={(selectedUsers) =>
                  setNewMeeting({ ...newMeeting, users: selectedUsers })
                }
                defaultValue={newMeeting.users}
                placeholder="Select Users"
                maxCount={3}
                modalPopover={true}
              />
            </div>

            <div className="items-center gap-4">
              <Label htmlFor="meetingroom">Meeting Room</Label>
              <Select
                name="meetingroom"
                value={newMeeting.meetingroom}
                onValueChange={(value) =>
                  setNewMeeting({ ...newMeeting, meetingroom: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {meetingRooms.map((room) => (
                    <SelectItem
                      key={room._id}
                      value={room.name}
                      className="cursor-pointer hover:bg-gray-100 whitespace-pre"
                    >
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="items-center gap-4">
              <Label htmlFor="date" className="flex gap-2 items-center">
                <CalendarDays className="h-4 w-4" />
                <p>Start Date And Time</p>
              </Label>
              <DateTimePicker
                value={newMeeting.startTime}
                onChange={(date) =>
                  setNewMeeting({ ...newMeeting, startTime: date })
                }
              />
            </div>

            <div className="items-center gap-4">
              <Label htmlFor="date" className="flex gap-2 items-center">
                <CalendarDays className="h-4 w-4" />
                <p>End Date And Time</p>
              </Label>
              <DateTimePicker
                value={newMeeting.endTime}
                onChange={(date) =>
                  setNewMeeting({ ...newMeeting, endTime: date })
                }
              />
            </div>

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
