import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

const router = Router();

// POST route to create a user
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - national_code
 *         - name
 *         - phone
 *         - password
 *       properties:
 *         national_code:
 *           type: string
 *           example: "1234567890"
 *         name:
 *           type: string
 *           example: "Ali"
 *         phone:
 *           type: string
 *           example: "09123456789"
 *         password:
 *           type: string
 *           example: "MySecret123"
 */

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user with hashed password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Phone number already exists
 *       500:
 *         description: Internal server error
 */
router.post('/create', UserController.createUser);

export default router;
