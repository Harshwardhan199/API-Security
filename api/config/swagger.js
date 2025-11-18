const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

// Load YAML file
const swaggerDocument = yaml.load("./docs/openapi.yaml");

module.exports = { swaggerUi, swaggerDocument };
