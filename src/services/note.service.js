import MongoNoteRepository from "../repositories/implementations/mongoNoteRepository.js";
import { AppError } from "../utils/errors.js";

class NoteService {
  constructor() {
    this.noteRepository = new MongoNoteRepository();
  }

  _assertOwner(note, userId) {
    if (!note) return;
    const ownerId = note.createdBy?._id ?? note.createdBy;
    if (!ownerId || ownerId.toString() !== userId.toString()) {
      throw new AppError("You do not have permission to access this note", 403);
    }
  }

  async createNote(noteData, userId) {
    const note = await this.noteRepository.createNote({
      ...noteData,
      createdBy: userId,
    });
    if (!note) {
      throw new AppError("Failed to create note", 500);
    }
    return note;
  }

  async getAllNotes(userId) {
    return this.noteRepository.findAllNotes({ createdBy: userId });
  }

  async getNoteById(id, userId) {
    const note = await this.noteRepository.findNoteById(id);
    if (!note) {
      throw new AppError("Note not found", 404);
    }
    this._assertOwner(note, userId);
    return note;
  }

  async updateNote(id, noteData, userId) {
    const existing = await this.noteRepository.findNoteById(id);
    if (!existing) {
      throw new AppError("Note not found", 404);
    }
    this._assertOwner(existing, userId);

    const updated = await this.noteRepository.updateNote(id, noteData);
    if (!updated) {
      throw new AppError("Note not found or update failed", 404);
    }
    return updated;
  }

  async deleteNote(id, userId) {
    const existing = await this.noteRepository.findNoteById(id);
    if (!existing) {
      throw new AppError("Note not found", 404);
    }
    this._assertOwner(existing, userId);

    const deleted = await this.noteRepository.deleteNote(id);
    if (!deleted) {
      throw new AppError("Note not found or delete failed", 404);
    }
    return deleted;
  }
}

export default new NoteService();
