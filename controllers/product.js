const Product = require("../models/product");
const jwt = require("jsonwebtoken");

exports.getProducts = async (req, res, next) => {
  let products;
  if (res.locals.loggedInUser.role !== "admin") {
    products = await Product.find({}).select("-created_by");
  } else {
    products = await Product.find({});
  }
  res.status(200).json({
    data: products,
  });
};

exports.getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    let product;
    if (res.locals.loggedInUser.role !== "admin") {
      product = await Product.findById(productId).select("-created_by");
    } else {
      product = await Product.findById(productId);
    }
    if (!product) return next(new Error("Product does not exist"));
    res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = new Product({
      name,
      price,
      description,
      created_by: res.locals.loggedInUser._id,
    });
    await newProduct.save();
    const accessToken = jwt.sign(
      { userId: res.locals.loggedInUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({
      data: { name: newProduct.name, id: newProduct._id },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const update = req.body;
    const productId = req.params.productId;
    await Product.findByIdAndUpdate(productId, update);
    const product = await Product.findById(productId);
    res.status(200).json({
      data: product,
      message: "Product has been updated",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({
      data: null,
      message: "Product has been deleted",
    });
  } catch (error) {
    next(error);
  }
};
