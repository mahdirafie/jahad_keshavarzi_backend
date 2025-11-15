import { Router } from 'express';
import { OTPController } from '../controllers/OTPController.js';

const router = Router();

/**
 * @swagger
 * /otp/send_otp:
 *   post:
 *     summary: Send OTP to a user's phone number
 *     tags:
 *       - OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "09123456789"
 *               national_code:
 *                 type: string
 *                 example: "0521596547"
 *             required:
 *               - phone
 *               - national_code
 *     responses:
 *       200:
 *         description: OTP code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP code sent successfully!"
 *       400:
 *         description: Phone number missing or cooldown not finished
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Try in 90"
 *       500:
 *         description: Internal server error
 */
router.post('/send_otp', OTPController.sendOTP);

/**
 * @swagger
 * /otp/verify_otp:
 *   post:
 *     summary: Verify OTP code for a phone number
 *     tags:
 *       - OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "09123456789"
 *               code:
 *                 type: string
 *                 example: "123456"
 *             required:
 *               - phone
 *               - code
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "کد تایید شد!"
 *       400:
 *         description: Wrong code or too many failed attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "کد وارد شده درست نمی باشد!"
 *       404:
 *         description: No OTP exists for the phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "there is no OTP for this number. try sending a new OTP!"
 *       500:
 *         description: Internal server error
 */
router.post('/verify_otp', OTPController.verifyOTP);

export default router;