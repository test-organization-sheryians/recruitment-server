import MongoNotesRepository from "../repositories/implementations/mongoNotesRepository.js";
import { AppError } from "../utils/errors.js";

class NotesService {
  constructor() {
    this.notesRepository = new MongoNotesRepository();
  }

  async createNote(data) {
    if (!data.title || !data.content) {
      throw new AppError("Error Title and content are required", 400);
    }

    const note = await this.notesRepository.createNote(data);
    return note;
  }

  async getOneNote(noteId) {
    const note = await this.notesRepository.getOneNote(noteId);

    if (!note) {
      throw new AppError("Note not Found", 404);
    }
    return note;
  }

  async updateNote(noteId, data) {
    const existingNote = await this.notesRepository.getOneNote(noteId);

    if (!existingNote) {
      throw new AppError("Note not found", 404);
    }

    const updatedNote = await this.notesRepository.updateNote(noteId, data);
    return updatedNote;
  }

  async deleteNote(noteId){
    const existingNote = await this.notesRepository.getOneNote(noteId)

    if(!existingNote){
        throw new AppError("Note not found", 404)
    }
     
    await this.notesRepository.deleteNote(noteId)

    return {message:"Note deleted succesfully"}
  }
}


export default NotesService