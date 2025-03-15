"use client";

import { useState, useEffect } from "react";
import { Meeting, meetingColumns } from "@/datatable/meetings";
import { formatDate } from "@/lib/utils";
import AddMeetingDialog from "./add-meeting-dialog";
import { DataTable } from "@/components/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Meetings() {
  const [users, setUsers] = useState([]);
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    };

    const fetchMeetingRooms = async () => {
      const res = await fetch("/api/meetingrooms");
      const data = await res.json();
      setMeetingRooms(data);
    };

    fetchUsers();
    fetchMeetingRooms();
  }, []);

  useEffect(() => {
    const fetchMeetings = async () => {
      const res = await fetch("/api/meetings");
      const data = await res.json();
      // Convert meetings with formatted start and end times
      const formattedMeetings = data.map((meeting: Meeting) => ({
        ...meeting,
        startTime: formatDate(meeting.startTime), // Format the starttime
        endTime: formatDate(meeting.endTime), // Format the endTime
      }));

      setMeetings(formattedMeetings);
    };

    fetchMeetings();
  }, [success]);

  const handleSuccess = () => {
    setSuccess((prev) => !prev); // Toggle the success state to trigger refetch
  };

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  return (
    <div className="p-10">
      <div className="flex justify-center text-3xl">
        Meeting Room Booking System
      </div>
      <div className="mt-10 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="text-xl">User Configuration</div>
          <div>
            <AddMeetingDialog
              onSuccess={handleSuccess}
              users={users}
              meetingRooms={meetingRooms}
            />
          </div>
        </div>
        <div>
          <DataTable columns={meetingColumns} data={meetings} />

          {/* Dialog to show meeting details */}
          <Dialog
            open={!!selectedMeeting}
            onOpenChange={(open) => !open && setSelectedMeeting(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Meeting Details</DialogTitle>
              </DialogHeader>
              {selectedMeeting && (
                <div className="space-y-4">
                  <div>
                    <strong>Title:</strong> {selectedMeeting.title}
                  </div>
                  <div>
                    <strong>Users:</strong> {selectedMeeting.users.join(", ")}
                  </div>
                  <div>
                    <strong>Meeting Room:</strong> {selectedMeeting.meetingRoom}
                  </div>
                  <div>
                    <strong>Start Time:</strong> {selectedMeeting.startTime}
                  </div>
                  <div>
                    <strong>End Time:</strong> {selectedMeeting.endTime}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
