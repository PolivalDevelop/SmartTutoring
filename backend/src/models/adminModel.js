const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  emailAdmin: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Admin", adminSchema);
