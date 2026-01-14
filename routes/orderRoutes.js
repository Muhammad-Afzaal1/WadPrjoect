// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const authenticateToken = require("../middleware/authenticateToken");

// POST /api/orders → Buy product instantly
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // 1. Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Check if product is enabled and has enough stock
    if (product.status !== 'enabled') {
      return res.status(400).json({ message: "This product is currently unavailable" });
    }
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // 3. Calculate total price
    const totalPrice = product.price * quantity;

    // 4. Create the order using user ID from JWT
    const newOrder = new Order({
      buyer: req.user.id,
      product: productId,
      quantity,
      totalPrice
    });

    // 5. Atomic-like update: Decrement product stock
    product.quantity -= quantity;
    await product.save();
    
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Purchase successful",
      order: savedOrder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:id → View order details
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("product", "name price")
      .populate("buyer", "username email"); //

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Authorization: Only the buyer or the seller of the product should see this
    // For now, let's restrict it to the buyer who placed it
    if (order.buyer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;