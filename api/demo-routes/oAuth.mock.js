const express = require("express");
const router = express.Router();
const db = require("./mockDb");

// Demo OAuth2 middleware
function demoOAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.split(" ")[1];

  if (token !== "DEMO-GOOGLE-TOKEN") {
    return res.status(401).json({ message: "Invalid demo OAuth token" });
  }
  next();
}

// ------------ DEMO LOGIN (No Google) --------------

router.post("/login", (req, res) => {
  res.json({
    access_token: "DEMO-GOOGLE-TOKEN",
    expires_in: 3600,
    user: {
      email: "demo.user@example.com",
      name: "Demo User"
    }
  });
});

// ---------------- CRUD (Mock) ----------------

router.get("/get", demoOAuth, (req, res) => {
  res.json(db.products);
});

router.post("/add", demoOAuth, (req, res) => {
  const product = { id: Date.now().toString(), ...req.body };
  db.products.push(product);
  res.json(product);
});

router.patch("/update/:id", demoOAuth, (req, res) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });

  Object.assign(product, req.body);
  res.json(product);
});

router.delete("/delete/:id", demoOAuth, (req, res) => {
  db.products = db.products.filter((p) => p.id !== req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
