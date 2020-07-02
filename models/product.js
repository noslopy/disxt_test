const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  created_by: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;
