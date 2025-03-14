"use client";
import { DataTable } from "@/components/data-table";
import { useState, useEffect } from "react";
import { AddMeetingRoomDialog } from "../meeting-rooms/add-meeting-room-dialog";
import { meetingRoomColumns } from "@/datatable/meeting-rooms";
import { toast } from "sonner";

export default function MeetingRooms() {
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchMeetingRooms = async () => {
      const res = await fetch("/api/meetingrooms");
      const data = await res.json();
      setMeetingRooms(data);
    };
    fetchMeetingRooms();
  }, [success]);

  const handleSuccess = () => {
    setSuccess((prev) => !prev); // Toggle the success state to trigger refetch
    toast.success("Meeting room created successfully");
  };

  return (
    <div className="p-10">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="text-xl">Meeting Rooms Configuration</div>
          <div>
            <AddMeetingRoomDialog onSuccess={handleSuccess} />
          </div>
        </div>
        <div>
          <DataTable columns={meetingRoomColumns} data={meetingRooms} />
        </div>
      </div>
    </div>
  );
}
