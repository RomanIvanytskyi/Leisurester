const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
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
  },
  description: {
    type: String,
  },
  file: {
    type: String,
    default: " ",
  },
});

module.exports = mongoose.model("leisure", LeisureSchema);
