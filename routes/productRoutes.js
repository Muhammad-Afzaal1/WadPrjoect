const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authenticateToken = require("../middleware/authenticateToken");
const isSeller = require('../middleware/isSeller');


// CREATE PRODUCT (PROTECTED)
router.post("/", authenticateToken, isSeller, async (req, res) => {
  try {
    const { name, description, price, quantity, category, images } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      category,
      images,
      seller: req.user.id, // 🔐 from JWT, NOT body
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET PRODUCT BY ID (PUBLIC)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product
      .findById(req.params.id)
      .populate("seller", "username email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE PRODUCT (PROTECTED)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE PRODUCT (PROTECTED)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
