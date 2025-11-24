import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { national_code: string };
}

export const is_auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "لطفا وارد حساب کاربری خود شوید!" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jahad_secret"
    ) as { national_code: string };

    // Attach user info to request
    req.user = { national_code: decoded.national_code };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "توکن شما منسوخ شده. لطفا دوباره وارد حساب خود شوید!" });
  }
};
