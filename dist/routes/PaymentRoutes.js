import { Router } from 'express';
import { PaymentController } from "../controllers/PaymentController.js";
const router = Router();
/**
 * @swagger
 * /payment/request:
 *   post:
 *     summary: Create a payment request
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Payment amount in Rials
 *                 example: 150000
 *               email:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *                 example: vida.shop1399@gmail.com
 *     responses:
 *       200:
 *         description: Payment request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/request', PaymentController.requestPayment);
/**
 * @swagger
 * /payment/verify:
 *   post:
 *     summary: Verify a payment after callback
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - authority
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The same amount used during request payment
 *                 example: 150000
 *               authority:
 *                 type: string
 *                 description: Authority code returned from payment gateway
 *                 example: A00000000000000000000000000123456789
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/verify', PaymentController.verifyPayment);
export default router;
//# sourceMappingURL=PaymentRoutes.js.map