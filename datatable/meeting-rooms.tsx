import { ColumnDef } from "@tanstack/react-table";

export type MeetingRoom = {
  id: string;
  name: string;
};

export const meetingRoomColumns: ColumnDef<MeetingRoom>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];
