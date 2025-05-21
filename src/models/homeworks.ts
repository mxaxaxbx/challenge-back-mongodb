import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    default: 0,
  },
});

export const Homework = mongoose.model("Homework", homeworkSchema);
