"use client";
import { DataTable } from "@/components/data-table";
import { useState, useEffect } from "react";
import { AddMeetingRoomDialog } from "../meeting-rooms/add-meeting-room-dialog";
import { meetingRoomColumns } from "@/datatable/meeting-rooms";
import { toast } from "sonner";
import { Loader } from "@/components/common/loader";

export default function MeetingRooms() {
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [error, setError] = useState(""); // ✅ Error state
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchMeetingRooms = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/meetingrooms");

        if (!res.ok) {
          throw new Error("Failed to fetch meeting rooms.");
        }

        const data = await res.json();
        setMeetingRooms(data);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
        toast.error(err.message || "Failed to load meeting rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingRooms();
  }, [success]);

  const handleSuccess = () => {
    setSuccess((prev) => !prev); // Toggle success to trigger refetch
  };

  return (
    <div className="p-10">
      <div className="flex flex-col gap-5">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">
            Meeting Rooms Configuration
          </div>
          <div>
            <AddMeetingRoomDialog onSuccess={handleSuccess} />
          </div>
        </div>

        {/* Data Section */}
        <div>
          {loading ? (
            // ✅ Beautiful Loader
            <div className="flex justify-center py-10">
              <Loader /> {/* Replace with a spinner/loading animation */}
            </div>
          ) : error ? (
            // ✅ Error State
            <div className="text-red-500 text-center py-6">{error}</div>
          ) : meetingRooms.length === 0 ? (
            // ✅ No Data State
            <div className="text-gray-500 text-center py-6">
              No meeting rooms available.
            </div>
          ) : (
            // ✅ Render DataTable
            <DataTable columns={meetingRoomColumns} data={meetingRooms} />
          )}
        </div>
      </div>
    </div>
  );
}
