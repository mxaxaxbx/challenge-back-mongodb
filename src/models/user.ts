import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["teacher", "student"],
    default: "student",
  },
  cohort: {
    type: String,
  },
});

export const User = mongoose.model("User", userSchema);
