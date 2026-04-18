import { Router } from "express";
import NoteController from "../controllers/note.controller.js";
import NoteService from "../../aplication/use-cases/note.service.js";
import  upload  from "../middlewares/upload.middleware.js";
 
//aqui definiremos que base de datos usar para las notas, en este caso MongoDB
import NoteMongoRepository from "../../infraestructure/database/mongo/note.mongo.repository.js";
import NoteMysqlRepository from "../../infraestructure/database/mysql/note.mysql.repository.js";
 
// inyeccion de dependencias
const noteRepository = new NoteMongoRepository();
//const noteRepository = new NoteMysqlRepository();
 
const noteService = new NoteService(noteRepository);
const noteController = new NoteController(noteService);
 
const router = Router();
 
//definir las rutas para las notas
router.post("/notes", upload.single('image'), noteController.createNote);
router.get("/notes", noteController.getNotesByUserId);
 
export default router;