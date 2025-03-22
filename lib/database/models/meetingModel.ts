import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  users: {
    type: [String], // Array of strings
    required: [true, "Users are required"],
  },
  startTime: {
    type: Date,
    required: [true, "Start time is required"],
  },
  endTime: {
    type: Date,
    required: [true, "End time is required"],
  },
  meetingroom: {
    type: String,
    required: [true, "Meeting room is required"],
  },
});

// ✅ Prevent OverwriteModelError
export const Meeting =
  mongoose.models.Meeting || mongoose.model("Meeting", meetingSchema);
