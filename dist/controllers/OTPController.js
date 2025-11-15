import bcrypt from "bcrypt";
import { OTP } from "../models/OTP.js";
import { Op } from "sequelize";
import { OTPStatus } from "../types/OTPStatus.js";
import { sendSMS } from "../config/SMS.js";
import { User } from "../models/User.js";
export class OTPController {
    static async sendOTP(req, res) {
        try {
            const { phone, national_code } = req.body;
            if (!phone || !national_code) {
                return res
                    .status(400)
                    .json({ message: "کد ملی و شماره همراه ضروری هستند!" });
            }
            const user = await User.findOne({
                where: {
                    national_code
                }
            });
            if (user) {
                return res.status(400).json({ message: "شماره در حال حاضر حساب کاربری دارید. لطفا وارد شوید!" });
            }
            const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
            // delete all the expired codes.
            const deleteResult = await OTP.destroy({
                where: {
                    created_at: {
                        [Op.lt]: twoMinutesAgo,
                    },
                },
            });
            // check if there is any valid , not expired code for the user
            const otp = await OTP.findOne({
                where: {
                    phone,
                    created_at: {
                        [Op.gt]: twoMinutesAgo,
                    },
                },
            });
            if (otp !== null) {
                const remainingSeconds = Math.max(0, Math.ceil((otp.created_at.getTime() + 2 * 60 * 1000 - Date.now()) / 1000));
                return res.status(400).json({ message: `${remainingSeconds} ثانیه دیگر دوباره امتحان کنید.` });
            }
            const otpCode = Math.floor(Math.random() * 900000 + 100000);
            const hashedCode = await bcrypt.hash(otpCode.toString(), 10);
            await OTP.create({
                code: hashedCode,
                phone,
            });
            const message = `کد تایید شما: ${otpCode}\nویدا`;
            await sendSMS(phone, message);
            return res.status(200).json({ message: "OTP code sent successfully!" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    static async verifyOTP(req, res) {
        try {
            const { phone, code } = req.body;
            if (!phone || !code) {
                return res
                    .status(400)
                    .json({ message: "phone and code are required!" });
            }
            const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
            const otp = await OTP.findOne({
                where: {
                    phone,
                    created_at: {
                        [Op.gt]: twoMinutesAgo,
                    },
                },
            });
            if (!otp) {
                return res.status(404).json({
                    message: "there is no OTP for this number. try sending a new OTP!",
                });
            }
            const isCodeRight = await bcrypt.compare(code, otp.code);
            if (!isCodeRight) {
                otp.efforts_remained = otp.efforts_remained - 1;
                await otp.save();
                if (otp.efforts_remained === 0) {
                    return res.status(400).json({
                        message: "تعداد تلاش های اشتباه بیش از حد مجاز شد. لطفا دوباره درخواست کد بدهید.",
                    });
                }
                return res.status(400).json({
                    message: "کد وارد شده درست نمی باشد!",
                });
            }
            // change the OTP status
            otp.status = OTPStatus.VERIFIED;
            await otp.save();
            return res.status(200).json({ message: "کد تایید شد!" });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error." });
        }
    }
}
//# sourceMappingURL=OTPController.js.map