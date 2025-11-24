import { Product } from "../models/Product.js";
export default class ProductController {
    // Create a new product
    static async createProduct(req, res) {
        try {
            const { name, price } = req.body;
            if (!name || price == null) {
                return res.status(400).json({ message: "نام و قیمت محصول الزامی هستند!" });
            }
            const product = await Product.create({
                name,
                price: BigInt(price) // convert to BigInt if coming as string/number
            });
            return res.status(201).json({
                message: "محصول با موفقیت ایجاد شد!",
                product: {
                    ...product.toJSON(),
                    price: product.price.toString() // convert BigInt to string
                }
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error!" });
        }
    }
    // Delete a product by id
    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: "محصول مورد نظر پیدا نشد!" });
            }
            await product.destroy();
            return res.status(200).json({ message: "محصول با موفقیت حذف شد!" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error!" });
        }
    }
    // Update product price
    static async updatePrice(req, res) {
        try {
            const { id } = req.params;
            const { price } = req.body;
            if (price == null) {
                return res.status(400).json({ message: "قیمت جدید الزامی است!" });
            }
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: "محصول مورد نظر پیدا نشد!" });
            }
            product.price = BigInt(price);
            await product.save();
            return res.status(200).json({
                message: "قیمت محصول با موفقیت به‌روزرسانی شد!",
                product: {
                    ...product.toJSON(),
                    price: product.price.toString() // convert BigInt to string
                }
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error!" });
        }
    }
}
//# sourceMappingURL=ProductController.js.map