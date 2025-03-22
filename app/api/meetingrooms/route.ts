import connectToDatabase from "@/lib/database/connection";
import { MeetingRoom } from "@/lib/database/models/meetingRoomModel";
import { NextResponse, NextRequest } from "next/server";

// Function to format the meeting room name
const formatMeetingRoomName = (name: string) => {
  return name
    .trim() // Remove leading/trailing spaces
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join words back (keeping internal spaces)
};
// GET request - Fetch all meeting rooms from MongoDB
export const GET = async () => {
  try {
    await connectToDatabase(); // Ensure database connection
    const meetingRooms = await MeetingRoom.find(); // Fetch meeting rooms
    return NextResponse.json(meetingRooms, { status: 200 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};

// POST request - Add a new meeting room to MongoDB
export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase(); // Ensure database connection

    const body = await req.json(); // Parse JSON request body

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { message: "Meeting room name is required and must be a string." },
        { status: 400 }
      );
    }

    const formattedName = formatMeetingRoomName(body.name); // Format the name

    // Check if the meeting room name already exists (case-insensitive)
    const existingRoom = await MeetingRoom.findOne({ name: formattedName });

    if (existingRoom) {
      return NextResponse.json(
        { message: "Meeting room with this name already exists." },
        { status: 400 }
      );
    }

    const newMeetingRoom = new MeetingRoom({ name: formattedName });

    await newMeetingRoom.save(); // Save to MongoDB

    return NextResponse.json(newMeetingRoom, { status: 201 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};
