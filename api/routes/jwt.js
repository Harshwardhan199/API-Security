const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Product = require("../models/Product");
const jwtAuth = require("../middlewares/jwtMiddleware");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // 🔍 Find user in MongoDB
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 🔐 Compare password with hashed password
  //const isMatch = await bcrypt.compare(password, user.password);
  const isMatch = (password == user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET || "myjwtsecret", { expiresIn: "1h" });
  res.json({ token });
});

router.post("/add", jwtAuth, async (req, res) => {
  const newProd = new Product(req.body);
  await newProd.save();
  res.json(newProd);
});

router.get("/get", jwtAuth, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.patch("/update/:id", jwtAuth, async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(prod);
});

router.delete("/delete/:id", jwtAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
