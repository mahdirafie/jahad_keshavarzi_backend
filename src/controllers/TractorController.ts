import { Request, Response } from "express";
import { Tractor } from "../models/Tractor.js";
import { User } from "../models/User.js";
import { ensureProfileComplete } from "../services/ensureUserProfileComplete.js";
import { Product } from "../models/Product.js";

export class TractorController {
  /**
   * Create a new tractor
   * @param req Request object
   * @param res Response object
   */
  static async createTractor(req: Request, res: Response) {
    try {
      const { model, production_year, power, cylinder_no } = req.body;

      const national_code = (req as any).user?.national_code;

      if (!national_code) {
        return res.status(400).json({ message: "کد ملی الزامی است!" });
      }

      const user = await User.findByPk(national_code);
      if(!user) {
        return res.status(400).json({message: 'کاربر یافت نشد!'});
      }

      try { 
        ensureProfileComplete(user);
      }catch(err: any) {
        return res.status(400).json({ message: err.message });
      }

      if (!model || !production_year) {
        return res
          .status(400)
          .json({ message: "نوع تراکتور و سال تولید الزامی هستند!" });
      }

      const newTractor = await Tractor.create({
        model,
        national_code,
        production_year,
        power: power ?? null,
        cylinder_no: cylinder_no ?? null,
      });

      res.status(201).json(newTractor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getAllTractorsForUser(req: Request, res: Response) {
    try {
      const national_code = (req as any).user?.national_code;

      if (!national_code) {
        return res.status(401).json({ message: "Unauthorized: No user info" });
      }

      const user = await User.findOne({
        where: { national_code },
        include: [{ model: Tractor, as: "tractors" }],
      });

      if (!user) {
        return res.status(404).json({ message: "کاربر یافت نشد!" });
      }

      try { 
        ensureProfileComplete(user);
      }catch(err: any) {
        return res.status(400).json({ message: err.message });
      }

      const tractors = await user.getTractors();

      if (!tractors || tractors.length === 0) {
        return res.status(200).json({
          message: "هیچ تراکتوری برای این کاربر پیدا نشد!",
          tractors: [],
        });
      }

      const product = await Product.findAll({attributes: ['price']});
      let price: number | null = null;
      if(product.length === 0  || !product) {
        price = null;
      }
      price = product[0].price;

      const responseData: any = {
        message: "با موفقیت دریافت شد",
        tractors,
      };
      
      if (price !== null) {
        responseData.price = price;   // Only added if not null
      }
      
      return res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server ERR" });
    }
  }

  static async getAllTractorsInfo(req: Request, res: Response) {
    try {
      // Fetch tractors along with their owners
      const tractors = await Tractor.findAll({
        include: [
          {
            model: User,
            as: "owner",
            attributes: ["city", "national_code"],
          },
        ],
      });

      const cityCounts: { [city: string]: number } = {};

      tractors.forEach((tractor) => {
        const ownerCity = tractor.owner?.city || "اراک"; // default if no city
        cityCounts[ownerCity] = (cityCounts[ownerCity] || 0) + 1;
      });

      return res.status(200).json({
        tractors,
        cities: cityCounts,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server ERR" });
    }
  }

  // delete a tractor by ID
  static async deleteTractorById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tractor ID" });
      }

      const tractor = await Tractor.findByPk(id);
      if (!tractor) {
        return res.status(404).json({ message: "تراکتور مورد نظر یافت نشد!" });
      }

      await tractor.destroy();
      return res
        .status(200)
        .json({ message: "تراکتور مورد نظر با موفقیت حذف شد!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
