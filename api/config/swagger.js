const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth Methods API",
      version: "1.0.0",
      description: "Demo API for Basic Auth, API Key, JWT, and OAuth flows",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },

  // Path to your route files where Swagger comments exist
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpec };
