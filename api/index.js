const express = require("express");
const cors = require("cors");
require("dotenv").config();

// File Imports
const connectDB = require("./config/db");
const basicAuth = require("./routes/basicAuth");
const apiKey = require("./routes/apiKey");
const jwt = require("./routes/jwt");
const oAuth = require("./routes/oAuth");

const { swaggerUi, swaggerSpec } = require("./config/swagger");

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes for each auth method
app.use("/basicAuth", basicAuth);
app.use("/apiKey", apiKey);
app.use("/jwt", jwt);
app.use("/oAuth", oAuth);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
