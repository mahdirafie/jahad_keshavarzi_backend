import { Tractor } from "../models/Tractor.js";
import { User } from "../models/User.js";
export class TractorController {
    /**
     * Create a new tractor
     * @param req Request object
     * @param res Response object
     */
    static async createTractor(req, res) {
        try {
            const { model, city } = req.body;
            const national_code = req.user?.national_code;
            if (!model || !national_code) {
                return res
                    .status(400)
                    .json({ message: "Model and national_code are required" });
            }
            const newTractor = await Tractor.create({ model, national_code, city });
            res.status(201).json(newTractor);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    static async getAllTractorsForUser(req, res) {
        try {
            const national_code = req.user?.national_code;
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
            const tractors = await user.getTractors();
            if (!tractors || tractors.length === 0) {
                return res.status(200).json({
                    message: "هیچ تراکتوری برای این کاربر پیدا نشد!",
                    tractors: [],
                });
            }
            return res.status(200).json({
                message: "با موفقیت دریافت شد",
                tractors,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server ERR" });
        }
    }
    static async getAllTractorsInfo(req, res) {
        try {
            // Fetch all tractors
            const tractors = await Tractor.findAll();
            // Count tractors per city in Markazi province
            // Assuming all cities in your DB belong to Markazi province
            const cityCounts = {};
            tractors.forEach((tractor) => {
                const city = tractor.city || "اراک"; // default if null
                if (cityCounts[city]) {
                    cityCounts[city]++;
                }
                else {
                    cityCounts[city] = 1;
                }
            });
            return res.status(200).json({
                tractors,
                cities: cityCounts,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server ERR" });
        }
    }
}
//# sourceMappingURL=TractorController.js.map