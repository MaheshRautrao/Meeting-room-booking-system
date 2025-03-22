import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/database/connection";
import { Meeting } from "@/lib/database/models/meetingModel";

// GET request - Fetch all meetings from MongoDB
export const GET = async () => {
  try {
    await connectToDatabase(); // Ensure database connection
    const meetings = await Meeting.find(); // Fetch meetings from DB
    return NextResponse.json(meetings, { status: 200 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};

// POST request - Add a new meeting to MongoDB
export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase(); // Ensure database connection

    const body = await req.json(); // Parse JSON request body

    const newMeeting = new Meeting({
      title: body.title,
      users: body.users,
      startTime: body.startTime,
      endTime: body.endTime,
      meetingroom: body.meetingroom,
    });

    await newMeeting.save(); // Save to MongoDB

    return NextResponse.json(newMeeting, { status: 201 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};
