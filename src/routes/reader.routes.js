import express from "express";
import ReaderController from "../controllers/reader.controller.js";

const router = express.Router();

const controller = new ReaderController();

router.post("/readers",controller.registerReader);

router.get("/readers",controller.getReaders);

export default router;