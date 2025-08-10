import Notes from "./../models/notes.model.js"

export const sendNote = async (req, res) => {
  try {
    // Match the frontend payload: {time_id, notes, checked}
    const { time_id, notes, checked } = req.body;

    const newNote = new Notes({
        id: time_id, // Map time_id to id field in database
        notes: notes,
        checked: checked
    });

    await newNote.save();

    res.status(201).json(newNote); // Return the note directly, not wrapped

  } catch (error) {
    console.error("Error sending message:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getNote = async (req, res) => {
  try {
    const notes = await Notes.find();
    res.status(200).json(notes); // Return array directly, not wrapped
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params; 

    // Use the custom 'id' field to match the time_id from frontend
    const deletedNote = await Notes.findOneAndDelete({ id: id });

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted", deletedNote });
  } catch (error) {
    console.error("Error deleting note:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};