const mongoose = require("mongoose");

const ApiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  owner: { type: String },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model("ApiKey", ApiKeySchema);
