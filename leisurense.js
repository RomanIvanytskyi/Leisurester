const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeisureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  persons: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("leisure", LeisureSchema);
