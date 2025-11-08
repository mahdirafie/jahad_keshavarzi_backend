import { Router } from 'express';
import { TractorLogController } from '../controllers/TractorLogController.js';
const router = Router();
/**
 * @swagger
 * tags:
 *   - name: TractorLog
 *     description: API for creating tractor log entries
 *
 * /tractor_log/create:
 *   post:
 *     summary: Create a new tractor log
 *     description: >
 *       Creates a new tractor log record.
 *       This endpoint accepts data directly from the tractor device.
 *       The password must be `"123456"`.
 *       Responses are plain text messages indicating status.
 *     tags: [TractorLog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pass:
 *                 type: string
 *                 example: "123456"
 *               tractor_id:
 *                 type: integer
 *                 example: 1
 *               sent_at:
 *                 type: string
 *                 example: "1761998332"
 *               lat:
 *                 type: number
 *                 example: 35.123450
 *               lon:
 *                 type: number
 *                 example: 50.123450
 *               distance:
 *                 type: number
 *                 example: 500
 *               in_fuel:
 *                 type: number
 *                 example: 12.34
 *               out_fuel:
 *                 type: number
 *                 example: 1.23
 *               rpm:
 *                 type: integer
 *                 example: 782
 *               cell_signal:
 *                 type: integer
 *                 example: 18
 *               temp:
 *                 type: number
 *                 example: 23.2
 *               retry_count:
 *                 type: integer
 *                 example: 0
 *               packet_day:
 *                 type: string
 *                 example: "0"
 *               packet_hour:
 *                 type: string
 *                 example: "0"
 *     responses:
 *       200:
 *         description: Tractor log saved successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "RECEIVED:\nSAVED\nSUCCESS"
 *       403:
 *         description: Incorrect password
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "RECEIVED:\nACCESS DENIED\nFAIL"
 *       400:
 *         description: Invalid JSON or missing fields
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "RECEIVED:\nInvalid JSON\nFAIL"
 */
router.post('/create', TractorLogController.createTractorLog);
/**
 * @swagger
 * /tractor_log/get_all:
 *   get:
 *     summary: دریافت لاگ‌های تراکتور در بازه زمانی مشخص
 *     description: بازگرداندن اطلاعات لاگ‌ها برای تراکتور مشخص در بازه‌های زمانی روز، هفته، ماه یا سال
 *     tags:
 *       - Tractor Logs
 *     parameters:
 *       - in: query
 *         name: time_range
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *         required: false
 *         description: بازه زمانی مورد نظر
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tractor_id:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: موفقیت‌آمیز
 *       400:
 *         description: پارامترها ناقص هستند
 *       404:
 *         description: تراکتور یافت نشد
 *       500:
 *         description: خطای داخلی سرور
 */
router.post("/get_all", TractorLogController.getAllLogsForTractor);
export default router;
//# sourceMappingURL=TractorLogRoutes.js.map