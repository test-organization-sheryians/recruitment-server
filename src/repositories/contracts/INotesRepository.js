
export class INotesRepository {
    async createNote(notesData){
        throw new Error ("Method createNote must be implemented")
    }

   async getOneNote(noteId){
    throw new Error ("Method getOneNote must be implemented")
   }

   async updateNote(noteId, data){
    throw new Error ("Method updateNote must be implemented")
   }

   async deleteNote(noteId){
    throw new Error ("Method delete note must be implemented")
   }
}