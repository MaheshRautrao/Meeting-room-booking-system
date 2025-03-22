import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/database/connection";
import { Employee } from "@/lib/database/models/employeeModel";

// Regular expression for employee code validation (EMP followed by digits)
const EMPLOYEE_CODE_REGEX = /^EMP\d+$/;

// GET request handler
export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase(); // Connect to MongoDB
    const employees = await Employee.find(); // Fetch employees from DB
    return NextResponse.json(employees, { status: 200 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};

// POST request handler - to add a new employee
export const POST = async (req: Request) => {
  try {
    await connectToDatabase(); // Ensure DB connection

    const body = await req.json(); // Parse JSON request body

    // Validate employeeCode format
    if (!EMPLOYEE_CODE_REGEX.test(body.employeeCode)) {
      return NextResponse.json(
        {
          message:
            "Invalid employee code. It should be in format EMP followed by numbers (e.g., EMP123).",
        },
        { status: 400 }
      );
    }

    // Check if employeeCode already exists
    const existingEmployee = await Employee.findOne({
      employeeCode: body.employeeCode,
    });

    if (existingEmployee) {
      return NextResponse.json(
        { message: "Employee code already exists." },
        { status: 400 }
      );
    }

    const newEmployee = new Employee({
      name: body.name,
      employeeCode: body.employeeCode,
    });

    await newEmployee.save(); // Save to MongoDB

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};
