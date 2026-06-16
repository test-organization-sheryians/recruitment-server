import {Router} from 'express'
import { createNote, getOneNote, updateNote, deleteNote } from '../controllers/notes.controller.js'

const notesRouter = Router()

notesRouter.post("/",createNote)
notesRouter.get("/:id",getOneNote)
notesRouter.put("/:id",updateNote)
notesRouter.delete("/:id",deleteNote)

export default notesRouter
