const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middlewares/basicAuthMiddleware");

/**
 * @swagger
 * tags:
 *   name: BasicAuth
 *   description: CRUD operations protected by Basic Authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *           example: iPhone 15
 *         category:
 *           type: string
 *           example: Mobile
 *         price:
 *           type: number
 *           example: 89999
 *
 *   securitySchemes:
 *     basicAuth:
 *       type: http
 *       scheme: basic
 */

/**
 * @swagger
 * /basicAuth/add:
 *   post:
 *     summary: Add a new product (Basic Auth protected)
 *     tags: [BasicAuth]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 */
router.post("/add", auth, async (req, res) => {
  const newProd = new Product(req.body);
  await newProd.save();
  res.json(newProd);
});

/**
 * @swagger
 * /basicAuth/get:
 *   get:
 *     summary: Get all products (Basic Auth protected)
 *     tags: [BasicAuth]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 */
router.get("/get", auth, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

/**
 * @swagger
 * /basicAuth/update/{id}:
 *   patch:
 *     summary: Update a product by ID (Basic Auth protected)
 *     tags: [BasicAuth]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *     responses:
 *       200:
 *         description: Updated product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 */
router.patch("/update/:id", auth, async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(prod);
});

/**
 * @swagger
 * /basicAuth/delete/{id}:
 *   delete:
 *     summary: Delete a product by ID (Basic Auth protected)
 *     tags: [BasicAuth]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
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
 *                   example: Product deleted
 */
router.delete("/delete/:id", auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
