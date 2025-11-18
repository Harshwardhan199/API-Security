const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middlewares/basicAuthMiddleware");

router.post("/add", auth, async (req, res) => {
  const newProd = new Product(req.body);
  await newProd.save();
  res.json(newProd);
});

router.get("/get", auth, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.patch("/update/:id", auth, async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(prod);
});

router.delete("/delete/:id", auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
