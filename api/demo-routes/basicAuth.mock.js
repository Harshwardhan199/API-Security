const express = require("express");
const router = express.Router();
const db = require("./mockDb");

// Demo username & password
const DEMO_USER = "demo";
const DEMO_PASS = "demo123";

// Fake Basic Auth middleware
function mockAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Demo API"');
    return res.status(401).json({ message: "Authentication required" });
  }

  const base64 = authHeader.replace("Basic ", "");
  const [username, password] = Buffer.from(base64, "base64")
    .toString()
    .split(":");

  if (username !== DEMO_USER || password !== DEMO_PASS) {
    return res.status(403).json({ message: "Invalid demo credentials" });
  }

  next();
}

// CREATE
router.post("/add", mockAuth, (req, res) => {
  const product = { id: Date.now().toString(), ...req.body };
  db.products.push(product);
  res.json(product);
});

// READ
router.get("/get", mockAuth, (req, res) => {
  res.json(db.products);
});

// UPDATE
router.patch("/update/:id", mockAuth, (req, res) => {
  const id = req.params.id;
  const index = db.products.findIndex((p) => p.id === id);

  if (index === -1) return res.status(404).json({ message: "Not found" });

  db.products[index] = { ...db.products[index], ...req.body };
  res.json(db.products[index]);
});

// DELETE
router.delete("/delete/:id", mockAuth, (req, res) => {
  db.products = db.products.filter((p) => p.id !== req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
