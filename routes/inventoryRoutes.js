// routes/inventoryRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authenticateToken = require("../middleware/authenticateToken");
const isSeller = require("../middleware/isSeller");
const isProductOwner = require("../middleware/isProductOwner");

// GET /api/inventory → View inventory
// Returns all products belonging to the authenticated seller
router.get("/", authenticateToken, isSeller, async (req, res) => {
  try {
    // Filter products where the seller field matches the logged-in user's ID
    const inventory = await Product.find({ seller: req.user.id })
      .select("name price quantity status category createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: inventory.length,
      inventory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.patch("/:id", authenticateToken, isSeller, isProductOwner, async (req, res) => {
  try {
    const { quantity, status } = req.body;
    const updateData = {};


    if (quantity !== undefined) {
        if (typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({ message: "Quantity must be a non-negative number" });
        }
        updateData.quantity = quantity; //
    }

    if (status) {
        if (!['enabled', 'disabled'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        updateData.status = status; //
    }

    // Use findByIdAndUpdate to apply changes
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Inventory updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;