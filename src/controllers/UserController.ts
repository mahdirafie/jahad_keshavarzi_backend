import { Request, Response } from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  // Create a new user
  static async createUser(req: Request, res: Response) {
    try {
      const { national_code, name, phone, password } = req.body;

      if (!national_code || !name || !phone || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        national_code,
        name,
        phone,
        password: hashedPassword,
      });

      // Exclude password in the response
      const { password: _, ...userWithoutPassword } = user.get();

      return res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      console.error(error);

      // Handle unique constraint error for phone
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ message: "Phone number already exists" });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { national_code, password } = req.body;

      if (!national_code || !password) {
        return res
          .status(400)
          .json({ message: "کد ملی و رمز عبور ضروری هستند!" });
      }

      // Find user
      const user = await User.findOne({ where: { national_code } });

      if (!user) {
        return res
          .status(404)
          .json({ message: "کاربر پیدا نشد! لطفا ثبت نام کنید." });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "اطلاعات وارد شده صحیح نمیباشد!" });
      }

      // Generate token (valid for 7 days)
      const token = jwt.sign(
        { national_code: user.national_code },
        process.env.JWT_SECRET || "jahad_secret",
        { expiresIn: "1YEAR" }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.get();

      return res.status(200).json({
        message: "Login successful",
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const national_code = (req as any).user?.national_code;

      if (!national_code) {
        return res.status(400).json({ message: "کد ملی الزامی است!" });
      }

      const user = await User.findByPk(national_code);
      if (!user) {
        return res.status(404).json({ message: "کاربر مورد نظر پیدا نشد!" });
      }

      // Convert Sequelize model to plain object
      const userData = { ...user.get() };

      // Remove password
      delete userData.password;

      // Remove null/undefined fields
      Object.keys(userData).forEach(
        (key) => userData[key] == null && delete userData[key]
      );

      return res.status(200).json({
        message: "کاربر با موفقیت پیدا شد!",
        user: userData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error!" });
    }
  }

  static async completeProfile(req: Request, res: Response) {
    try {
      const national_code = (req as any).user?.national_code;

      if (!national_code) {
        return res.status(400).json({ message: "کد ملی الزامی است!" });
      }

      const { father_name, village, birth_date, ownership_type, profile_image, address, province, city } = req.body;

      if (!province || !city || !address) {
        return res
          .status(400)
          .json({ message: "تمامی فیلد های آدرس مورد نیاز هستند!" });
      }

      const user = await User.findByPk(national_code);
      if (!user) {
        return res.status(404).json({ message: "کاربر مورد نظر پیدا نشد!" });
      }

      await user.update({
        father_name,
        village,
        birth_date,
        ownership_type,
        profile_image,
        address,
        province,
        city,
      });

      const userData = { ...user.get() };
      delete userData.password;
      Object.keys(userData).forEach(
        (key) => userData[key] == null && delete userData[key]
      );

      return res.status(200).json({
        message: "پروفایل با موفقیت تکمیل شد!",
        user: userData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error!" });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      console.log("HERRERE");
      const users = await User.findAll();
      return res
        .status(200)
        .json({ message: "کاربران با موفقیت دریافت شدند!", users });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "خطای داخلی سرور!" });
    }
  }
}
