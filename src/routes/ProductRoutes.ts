import { Router } from "express";
import ProductController from "../controllers/ProductController.js";

const router = Router();

/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Create a new product
 *     description: Adds a new product with a name and price.
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: string
 *                 description: Price as a string or number (BIGINT)
 *             required:
 *               - name
 *               - price
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/create", ProductController.createProduct);

/**
 * @swagger
 * /product/delete/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by its ID.
 *     tags:
 *       - Product
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Product ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:id", ProductController.deleteProduct);

/**
 * @swagger
 * /product/{id}/price:
 *   put:
 *     summary: Update product price
 *     description: Updates the price of an existing product.
 *     tags:
 *       - Product
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Product ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: string
 *                 description: New price (BIGINT)
 *             required:
 *               - price
 *     responses:
 *       200:
 *         description: Price updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id/price", ProductController.updatePrice);

export default router;