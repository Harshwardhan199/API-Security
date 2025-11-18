const express = require("express");
const cors = require("cors");
require("dotenv").config();

// File Imports
const connectDB = require("./config/db");
const basicAuth = require("./routes/basicAuth");
const apiKey = require("./routes/apiKey");
const jwt = require("./routes/jwt");
const oAuth = require("./routes/oAuth");

const { swaggerUi, swaggerDocument } = require("./config/swagger");

// Middlewares
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Connect MongoDB
connectDB();

// Swagger Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Demo Routes
app.use("/demo/basicAuth", require("./demo-routes/basicAuth.mock"));
app.use("/demo/apiKey", require("./demo-routes/apiKey.mock"));
app.use("/demo/jwt", require("./demo-routes/jwt.mock"));
app.use("/demo/oAuth", require("./demo-routes/oAuth.mock"));

// Routes for each auth method
app.use("/basicAuth", basicAuth);
app.use("/apiKey", apiKey);
app.use("/jwt", jwt);
app.use("/oAuth", oAuth);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
