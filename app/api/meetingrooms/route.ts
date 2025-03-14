import { NextResponse ,NextRequest} from "next/server"; 
import { readData,writeData } from "@/helper";

// GET request handler
export const GET = async (req: NextRequest) => {
  try {
    const data = readData(); // Read the data synchronously
    return new NextResponse(JSON.stringify(data.meetingRooms), { status: 200 }); // Respond with the data
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};

// POST request handler - to add a new user
export const POST = async (req: NextRequest) => {
  try {
    // Parse the incoming JSON body
    const newMeetingRoom = await req.json();
    const data = readData();
    newMeetingRoom.id = data.meetingRooms.length + 1;
    data.meetingRooms.push(newMeetingRoom);
    writeData(data);
    return new NextResponse(JSON.stringify(newMeetingRoom), { status: 201 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};
