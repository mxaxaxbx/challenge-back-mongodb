import mongoose, { Document, Schema } from "mongoose";

// 1. Define la interfaz con los tipos correctos
interface HomeworkDocument extends Document {
  content: string;
  course: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  score?: number;
}

// 2. Usa la interfaz como genérico en mongoose.model
const homeworkSchema = new Schema<HomeworkDocument>({
  content: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  student: { type: Schema.Types.ObjectId, ref: "User" },
  teacher: { type: Schema.Types.ObjectId, ref: "User" },
  score: { type: Number },
});

export const Homework = mongoose.model<HomeworkDocument>("Homework", homeworkSchema);
