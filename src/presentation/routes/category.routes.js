import { Router } from "express";
import CategoryController from "../controllers/category.controller.js";
import CategoryService from "../../aplication/use-cases/category.service.js";
import CategoryMySQLRepository from "../../infraestructure/database/mysql/category.mysql.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const categoryRepository = new CategoryMySQLRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestión de categorías de notas
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ideas
 *               description:
 *                 type: string
 *                 example: Categoría para ideas personales
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token faltante o inválido
 */
router.post("/", authMiddleware, categoryController.createCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener categorías del usuario autenticado
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categorías obtenidas exitosamente
 *       401:
 *         description: Token faltante o inválido
 */
router.get("/", authMiddleware, categoryController.getCategoriesByUserId);

export default router;