import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Notes = mongoose.model("notes", notesSchema);
export default Notes;
