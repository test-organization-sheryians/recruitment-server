import NotesService from "../services/notes.service.js";

const notesService = new NotesService();

export const createNote = async (req, res, next) => {
  try {
    const note = await notesService.createNote(req.body);

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

export const getOneNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const note = await notesService.getOneNote(id);

    return res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedNote = await notesService.updateNote(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Note Updated Successfully",
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await notesService.deleteNote(id);

    res.status(200).json({ success: true, ...response });
  } catch (error) {
    next(error);
  }
};


