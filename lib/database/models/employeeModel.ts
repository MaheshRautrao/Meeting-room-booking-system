import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  employeeCode: {
    type: String,
    required: [true, "Employee code is required"],
    unique: true, // Ensure employeeCode is unique
  },
});

// ✅ Prevent OverwriteModelError
export const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
