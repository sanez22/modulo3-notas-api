import { Router } from "express";
import NoteController from "../controllers/note.controller.js";
import NoteService from "../../aplication/use-cases/note.service.js";
import  upload  from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

// Importamos el repositorio de MySQL y el servicio de Mail
import NoteMySQLRepository from "../../infraestructure/database/mysql/note.mysql.repository.js";
import MailService from "../../infraestructure/services/mail.service.js";

// inyeccion de dependencias
const mailService = new MailService();
const noteRepository = new NoteMySQLRepository();
const noteService = new NoteService(noteRepository, mailService);
const noteController = new NoteController(noteService);

const router = Router();

/**
 * @swagger
 * /notes:
 * post:
 * summary: Obtener todas las notas del usuario autenticado
 * tags: [Notes]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de notas obtenida exitosamente
 * 401:
 * description: No autorizado, token faltante o inválido
 */
 
router.post("/", authMiddleware, upload.single('image'), noteController.createNote);
/**
 * @swagger
 * /notes:
 * get:
 * summary: Obtener todas las notas del usuario autenticado
 * tags: [Notes]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de notas obtenida exitosamente
 * 401:
 * description: No autorizado, token faltante o inválido
 */
router.get("/", authMiddleware, noteController.getNotesByUserId);

/**
 * @swagger
 * /notes/{id}/public:
 *   get:
 *     summary: Obtener una nota pública sin autenticación
 *     description: Permite consultar una nota sin JWT solo si no es privada.
 *     tags: [Notes]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nota
 *     responses:
 *       200:
 *         description: Nota pública obtenida exitosamente
 *       403:
 *         description: La nota es privada
 *       404:
 *         description: Nota no encontrada
 */

router.get("/:id/public", noteController.getPublicNoteById);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Actualizar una nota por ID
 *     description: Solo el usuario propietario de la nota puede actualizarla.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nota
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Nota actualizada
 *               content:
 *                 type: string
 *                 example: Nuevo contenido de la nota
 *               image:
 *                 type: string
 *                 format: binary
 *               isPrivate:
 *                 type: boolean
 *                 example: false
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Nota actualizada exitosamente
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para actualizar esta nota
 *       404:
 *         description: Nota no encontrada
 */

router.put("/:id", authMiddleware, upload.single("image"), noteController.updateNote);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Eliminar una nota por ID
 *     description: Solo el usuario propietario de la nota puede eliminarla.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nota
 *     responses:
 *       200:
 *         description: Nota eliminada exitosamente
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para eliminar esta nota
 *       404:
 *         description: Nota no encontrada
 */
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), noteController.deleteNote);

/**
 * @swagger
 * /notes/{id}/share:
 *   post:
 *     summary: Compartir una nota por correo electrónico
 *     description: Solo el usuario propietario de la nota puede compartirla.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: destino@email.com
 *     responses:
 *       200:
 *         description: Nota compartida exitosamente
 *       400:
 *         description: Email requerido o datos inválidos
 *       401:
 *         description: Token faltante o inválido
 *       403:
 *         description: No autorizado para compartir esta nota
 *       404:
 *         description: Nota no encontrada
 */
router.post("/:id/share", authMiddleware, noteController.shareNote);

export default router;