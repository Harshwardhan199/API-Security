const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const apiKeyAuth = require("../middlewares/apiKeyMiddleware");

router.post("/add", apiKeyAuth, async (req, res) => {
  const newProd = new Product(req.body);
  await newProd.save();
  res.json(newProd);
});

router.get("/get", apiKeyAuth, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.patch("/update/:id", apiKeyAuth, async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(prod);
});

router.delete("/delete/:id", apiKeyAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
