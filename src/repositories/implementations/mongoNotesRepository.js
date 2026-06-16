import { Note } from "../../models/notes.model.js";
import { INotesRepository } from "../contracts/INotesRepository.js";
import { AppError } from "../../utils/errors.js";

class MongoNotesRepository extends INotesRepository {
  async createNote(data) {
    try {
      const notes = await Note.create(data);
      return notes;
    } catch (error) {
      throw new AppError("Error creating notes" + error.message, 500);
    }
  }

  async getOneNote(noteId) {
    try {
      return await Note.findById(noteId);
    } catch (error) {
      throw new AppError("Error getting note" + error.message, 500);
    }
  }

  async updateNote(noteId, data) {
    try {
      const updated = await Note.findByIdAndUpdate(noteId, data);
      return updated;
    } catch (error) {
      throw new AppError("Error updating note" + error.message, 500);
    }
  }

  async deleteNote(noteId) {
    try {
      return await Note.findByIdAndDelete(noteId);
    } catch (error) {
      throw new AppError("Error deleting note" + error.message, 500);
    }
  }
}

export default MongoNotesRepository
