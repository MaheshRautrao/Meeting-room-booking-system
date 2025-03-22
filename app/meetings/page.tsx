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
import { toast } from "sonner";
import { Loader } from "@/components/common/loader";

export default function Meetings() {
  const [users, setUsers] = useState([]);
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMeetingRooms, setLoadingMeetingRooms] = useState(true);
  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [error, setError] = useState(""); // ✅ Error state
  const [success, setSuccess] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users.");
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
        toast.error(err.message || "Failed to load users.");
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchMeetingRooms = async () => {
      setLoadingMeetingRooms(true);
      try {
        const res = await fetch("/api/meetingrooms");
        if (!res.ok) throw new Error("Failed to fetch meeting rooms.");
        const data = await res.json();
        setMeetingRooms(data);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
        toast.error(err.message || "Failed to load meeting rooms.");
      } finally {
        setLoadingMeetingRooms(false);
      }
    };

    fetchUsers();
    fetchMeetingRooms();
  }, []);

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoadingMeetings(true);
      try {
        const res = await fetch("/api/meetings");
        if (!res.ok) throw new Error("Failed to fetch meetings.");
        const data = await res.json();

        const formattedMeetings = data.map((meeting: Meeting) => ({
          ...meeting,
          startTime: formatDate(meeting.startTime), // Format start time
          endTime: formatDate(meeting.endTime), // Format end time
        }));

        setMeetings(formattedMeetings);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
        toast.error(err.message || "Failed to load meetings.");
      } finally {
        setLoadingMeetings(false);
      }
    };

    fetchMeetings();
  }, [success]);

  const handleSuccess = () => {
    setSuccess((prev) => !prev); // Toggle success state to trigger refetch
  };

  return (
    <div className="p-10">
      <div className="flex justify-center text-3xl font-semibold">
        Meeting Room Booking System
      </div>

      <div className="mt-10 flex flex-col gap-5">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">Meeting Configuration</div>
          <div>
            <AddMeetingDialog
              onSuccess={handleSuccess}
              users={users}
              meetingRooms={meetingRooms}
            />
          </div>
        </div>

        {/* Data Section */}
        <div>
          {loadingUsers || loadingMeetingRooms || loadingMeetings ? (
            // ✅ Show Loader While Fetching
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          ) : error ? (
            // ✅ Error State
            <div className="text-red-500 text-center py-6">{error}</div>
          ) : meetings.length === 0 ? (
            // ✅ No Data State
            <div className="text-gray-500 text-center py-6">
              No meetings available.
            </div>
          ) : (
            // ✅ Render DataTable
            <DataTable columns={meetingColumns} data={meetings} />
          )}
        </div>
      </div>

      {/* Dialog to Show Meeting Details */}
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
  );
}
