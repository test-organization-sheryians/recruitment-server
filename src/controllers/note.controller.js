import noteService from "../services/note.service.js";

class NoteController {
  createNote = async (req, res, next) => {
    try {
      const note = await noteService.createNote(req.body, req.userId);
      res.status(201).json({ success: true, data: note });
    } catch (error) {
      next(error);
    }
  };

  getAllNotes = async (req, res, next) => {
    try {
      const notes = await noteService.getAllNotes(req.userId);
      res.status(200).json({ success: true, data: notes });
    } catch (error) {
      next(error);
    }
  };

  getNoteById = async (req, res, next) => {
    try {
      const note = await noteService.getNoteById(req.params.id, req.userId);
      res.status(200).json({ success: true, data: note });
    } catch (error) {
      next(error);
    }
  };

  updateNote = async (req, res, next) => {
    try {
      const note = await noteService.updateNote(
        req.params.id,
        req.body,
        req.userId
      );
      res.status(200).json({ success: true, data: note });
    } catch (error) {
      next(error);
    }
  };

  deleteNote = async (req, res, next) => {
    try {
      await noteService.deleteNote(req.params.id, req.userId);
      res.status(200).json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

export default new NoteController();
