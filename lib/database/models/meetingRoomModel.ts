import mongoose from "mongoose";

const meetingRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Meeting room name is required"],
  },
});

// ✅ Prevent OverwriteModelError
export const MeetingRoom =
  mongoose.models.MeetingRoom ||
  mongoose.model("MeetingRoom", meetingRoomSchema);
