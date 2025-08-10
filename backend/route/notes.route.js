import express from "express";
import { deleteNote, getNote,sendNote } from "../controllers/notes.controllers.js";

const router = express.Router();


router.get("/get",  getNote);
router.post("/post",  sendNote);
router.delete("/delete/:id",deleteNote);

export default router;
