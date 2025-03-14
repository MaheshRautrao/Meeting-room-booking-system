import { NextResponse ,NextRequest} from "next/server"; 
import { readData,writeData } from "@/helper";

// GET request handler
export const GET = async (req: NextRequest) => {
  try {
    const data = readData(); // Read the data synchronously
    return new NextResponse(JSON.stringify(data.users), { status: 200 }); // Respond with the data
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};

// POST request handler - to add a new user
export const POST = async (req: NextRequest) => {
  try {
    // Parse the incoming JSON body
    const newUser = await req.json();
    const data = readData();
    newUser.id = data.users.length + 1;
    data.users.push(newUser);
    writeData(data);
    return new NextResponse(JSON.stringify(newUser), { status: 201 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};
