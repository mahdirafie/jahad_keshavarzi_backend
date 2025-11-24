import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { User } from '../models/User.js';
import { is_auth } from '../middlewares/is_auth.js';

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


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in a user with national code and password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - national_code
 *               - password
 *             properties:
 *               national_code:
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: Login success — returns JWT token and user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     national_code:
 *                       type: string
 *                     name:
 *                       type: string
 *                     phone:
 *                       type: string
 *       400:
 *         description: Missing national code or password
 *       401:
 *         description: Invalid national code or incorrect password
 *       500:
 *         description: Internal server error
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /user/get_profile:
 *   get:
 *     summary: دریافت اطلاعات پروفایل کاربر
 *     description: بازگرداندن نام، کدملی و شماره تلفن براساس `national_code` موجود در شیء user (مثلاً از توکن/سشن).
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: کاربر با موفقیت پیدا شد.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "کاربر با موفقیت پیدا شد!"
 *                 name:
 *                   type: string
 *                   example: "علی رضایی"
 *                 national_code:
 *                   type: string
 *                   example: "0012345678"
 *                 phone:
 *                   type: string
 *                   example: "09123456789"
 *       400:
 *         description: کد ملی الزامی است.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "کد ملی الزامی است!"
 *       404:
 *         description: کاربر مورد نظر پیدا نشد.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "کاربر مورد نظر پیدا نشد!"
 *       500:
 *         description: خطای داخلی سرور
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error!"
 */
router.get('/get_profile', is_auth, UserController.getProfile);

/**
 * @swagger
 * /user/complete_profile:
 *   put:
 *     summary: تکمیل پروفایل کاربر
 *     description: این متد اطلاعات تکمیلی پروفایل را برای کاربر واردشده ذخیره می‌کند.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postal_code:
 *                 type: string
 *                 example: "1234567890"
 *               landline_phone:
 *                 type: string
 *                 example: "02144556677"
 *               address:
 *                 type: string
 *                 example: "تهران، خیابان آزادی، پلاک ۱۲۳"
 *               province:
 *                 type: string
 *                 example: "تهران"
 *               city:
 *                 type: string
 *                 example: "تهران"
 *             required:
 *               - province
 *               - city
 *
 *     responses:
 *       200:
 *         description: پروفایل با موفقیت تکمیل شد.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "پروفایل با موفقیت تکمیل شد!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     national_code:
 *                       type: string
 *                       example: "0012345678"
 *                     name:
 *                       type: string
 *                       example: "علی رضایی"
 *                     phone:
 *                       type: string
 *                       example: "09123456789"
 *                     postal_code:
 *                       type: string
 *                       example: "1234567890"
 *                     landline_phone:
 *                       type: string
 *                       example: "02144556677"
 *                     address:
 *                       type: string
 *                       example: "تهران، خیابان آزادی"
 *                     province:
 *                       type: string
 *                       example: "تهران"
 *                     city:
 *                       type: string
 *                       example: "تهران"
 *
 *       400:
 *         description: درخواست نامعتبر (استان و شهر الزامی هستند).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "استان و شهر الزامی هستند!"
 *
 *       404:
 *         description: کاربر مورد نظر پیدا نشد.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "کاربر مورد نظر پیدا نشد!"
 *
 *       500:
 *         description: خطای داخلی سرور.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error!"
 */
router.put('/complete_profile', is_auth, UserController.completeProfile);

export default router;
