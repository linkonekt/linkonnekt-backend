const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Email", emailSchema);
