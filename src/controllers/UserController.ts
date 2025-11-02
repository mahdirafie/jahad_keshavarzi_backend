import { Request, Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

export class UserController {

  // Create a new user
  static async createUser(req: Request, res: Response) {
    try {
      const { national_code, name, phone, password } = req.body;

      if (!national_code || !name || !phone || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        national_code,
        name,
        phone,
        password: hashedPassword
      });

      // Exclude password in the response
      const { password: _, ...userWithoutPassword } = user.get();

      return res.status(201).json(userWithoutPassword);

    } catch (error: any) {
      console.error(error);

      // Handle unique constraint error for phone
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'Phone number already exists' });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
