class INoteRepository {
  async createNote(noteData) {
    throw new Error("Method not implemented");
  }

  async findNoteById(id) {
    throw new Error("Method not implemented");
  }

  async findAllNotes(filter = {}) {
    throw new Error("Method not implemented");
  }

  async updateNote(id, noteData) {
    throw new Error("Method not implemented");
  }

  async deleteNote(id) {
    throw new Error("Method not implemented");
  }
}

export default INoteRepository;
