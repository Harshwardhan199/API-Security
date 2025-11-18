const express = require("express");
const router = express.Router();
const db = require("./mockDb");

// Demo JWT middleware
function demoJwtAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.split(" ")[1];

  if (token !== "DEMO-JWT-TOKEN") {
    return res.status(401).json({ message: "Invalid demo JWT" });
  }
  next();
}

// ---------------- LOGIN ----------------

router.post("/login", (req, res) => {
  res.json({
    token: "DEMO-JWT-TOKEN",
    expires_in: 3600
  });
});

// ---------------- CRUD (Mock) ----------------

router.get("/get", demoJwtAuth, (req, res) => {
  res.json(db.products);
});

router.post("/add", demoJwtAuth, (req, res) => {
  const product = { id: Date.now().toString(), ...req.body };
  db.products.push(product);
  res.json(product);
});

router.patch("/update/:id", demoJwtAuth, (req, res) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });

  Object.assign(product, req.body);
  res.json(product);
});

router.delete("/delete/:id", demoJwtAuth, (req, res) => {
  db.products = db.products.filter((p) => p.id !== req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
