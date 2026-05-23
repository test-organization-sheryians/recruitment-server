import mongoose from "mongoose";
import Note from "../../models/note.model.js";
import INoteRepository from "../contracts/INoteRepository.js";
import { AppError } from "../../utils/errors.js";

class MongoNoteRepository extends INoteRepository {
  async createNote(noteData) {
    try {
      const note = new Note(noteData);
      return await note.save();
    } catch (error) {
      throw new AppError(error.message || "Failed to create note", 500);
    }
  }

  async findNoteById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid note ID", 400);
    }
    return Note.findById(id).lean();
  }

  async findAllNotes(filter = {}) {
    return Note.find(filter).sort({ updatedAt: -1 }).lean();
  }

  async updateNote(id, noteData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid note ID", 400);
    }
    return Note.findByIdAndUpdate(id, noteData, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async deleteNote(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid note ID", 400);
    }
    return Note.findByIdAndDelete(id).lean();
  }
}

export default MongoNoteRepository;
