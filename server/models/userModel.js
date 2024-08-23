import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, unique: true },
    firstName: String,
    lastName: String,
    profilePic: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
