import { Router } from "express";
import { TractorController } from "../controllers/TractorController.js";
import { is_auth } from "../middlewares/is_auth.js";

const router = Router();

/**
 * @swagger
 * /tractors:
 *   post:
 *     summary: Create a new tractor
 *     description: Creates a tractor record for the authenticated user. `model` and `production_year` are required fields; `power` and `cylinder_no` are optional.
 *     tags:
 *       - Tractor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *                 example: MF 285
 *               production_year:
 *                 type: integer
 *                 example: 2020
 *               power:
 *                 type: integer
 *                 nullable: true
 *                 example: 75
 *               cylinder_no:
 *                 type: integer
 *                 nullable: true
 *                 example: 4
 *     responses:
 *       201:
 *         description: Tractor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tractor'
 *       400:
 *         description: Bad Request – Missing required fields or national code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "نوع تراکتور و سال تولید الزامی هستند!"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/create", is_auth, TractorController.createTractor);

/**
 * @swagger
 * /tractor/by_user:
 *   post:
 *     summary: دریافت تراکتورهای یک کاربر با استفاده از کد ملی
 *     description: این متد تمام تراکتورهای متعلق به یک کاربر خاص را با استفاده از کد ملی برمی‌گرداند.
 *     tags: [Tractor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *     responses:
 *       200:
 *         description: لیست تراکتورها با موفقیت بازگردانده شد.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tractors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tractor'
 *       400:
 *         description: کد ملی ارسال نشده است.
 *       404:
 *         description: کاربر یافت نشد.
 *       500:
 *         description: خطای داخلی سرور.
 */
router.get("/by_user", is_auth, TractorController.getAllTractorsForUser);

/**
 * @swagger
 * /tractor/info_all:
 *   get:
 *     summary: دریافت اطلاعات کلی تراکتورها و تعداد آنها در شهرهای استان مرکزی
 *     description: این متد تمام تراکتورها را برمی‌گرداند و به صورت جداگانه تعداد تراکتورها در هر شهر استان مرکزی را نمایش می‌دهد.
 *     tags: [Tractor]
 *     responses:
 *       200:
 *         description: اطلاعات تراکتورها با موفقیت بازگردانده شد.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tractors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tractor'
 *                 cities:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       500:
 *         description: خطای داخلی سرور
 */
router.get("/info_all", TractorController.getAllTractorsInfo);

export default router;
