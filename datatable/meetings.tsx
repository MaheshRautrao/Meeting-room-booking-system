"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export type Meeting = {
  _id: string;
  title: string;
  users: string[];
  meetingRoom: string;
  startTime: string;
  endTime: string;
};

// Function to format text (add ellipsis if too long)
const formatText = (text?: string, maxLength = 20) => {
  if (!text) return ""; // Handle undefined or empty values
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export const meetingColumns: ColumnDef<Meeting>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title: string | undefined = row.getValue("title") || "";

      return (
        <Tooltip>
          <TooltipTrigger className="truncate max-w-[150px] block">
            {formatText(title)}
          </TooltipTrigger>
          {title && title.length > 20 && (
            <TooltipContent>{title}</TooltipContent>
          )}
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "users",
    header: "Users",
    cell: ({ row }) => {
      const users: string[] = row.getValue("users") || []; // Ensure it's always an array
      const maxVisible = 2;
      const extraCount = users.length - maxVisible;
      const userList = users.join(", "); // Full user list

      return (
        <Tooltip>
          <TooltipTrigger className="flex items-center space-x-1">
            {/* Show first few users */}
            {users.slice(0, maxVisible).map((user, index) => (
              <Badge key={index} variant="secondary">
                {user}
              </Badge>
            ))}

            {/* Show "+count more" with full user list in tooltip */}
            {extraCount > 0 && (
              <span className="text-sm text-gray-500 cursor-pointer">
                +{extraCount} more
              </span>
            )}
          </TooltipTrigger>
          {users.length > maxVisible && (
            <TooltipContent>{userList}</TooltipContent>
          )}
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "meetingroom",
    header: "Meeting Room",
    cell: ({ row }) => {
      const meetingRoom: string | undefined = row.getValue("meetingroom") || "";

      return (
        <Tooltip>
          <TooltipTrigger className="truncate max-w-[150px] block">
            {formatText(meetingRoom)}
          </TooltipTrigger>
          {meetingRoom && meetingRoom.length > 20 && (
            <TooltipContent>{meetingRoom}</TooltipContent>
          )}
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
  },
  {
    accessorKey: "endTime",
    header: "End Time",
  },
];
