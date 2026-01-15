// routes/auctionRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Bid = require("../models/Bid");
const authenticateToken = require("../middleware/authenticateToken");
const isProductOwner = require("../middleware/isProductOwner");

// POST /api/auctions/start → Start auction
router.post("/:id/start", authenticateToken, isProductOwner, async (req, res) => {
  try {
    const { durationHours, startingBid } = req.body;
    
    // req.product is provided by isProductOwner middleware
    req.product.isAuction = true;
    req.product.startingBid = startingBid;
    req.product.auctionEnd = new Date(Date.now() + durationHours * 60 * 60 * 1000);
    
    await req.product.save();
    res.status(200).json({ message: "Auction started", product: req.product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/bids → Place bid
router.post("/bid", authenticateToken, async (req, res) => {
  try {
    const { productId, amount } = req.body;
    const product = await Product.findById(productId);

    if (!product || !product.isAuction) {
      return res.status(400).json({ message: "Auction not found" });
    }

    if (new Date() > product.auctionEnd) {
      return res.status(400).json({ message: "Auction has ended" });
    }

    // Find current highest bid
    const highestBid = await Bid.findOne({ product: productId }).sort({ amount: -1 });
    const minimumRequired = highestBid ? highestBid.amount : product.startingBid;

    if (amount <= minimumRequired) {
      return res.status(400).json({ message: `Bid must be higher than ${minimumRequired}` });
    }
    if (product.seller.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot bid on your own product" });
    }
    const newBid = new Bid({
      product: productId,
      bidder: req.user.id, //
      amount
    });

    await newBid.save();
    res.status(201).json({ message: "Bid placed successfully", bid: newBid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/bids/:productId → View bids
router.get("/bid/:productId", async (req, res) => {
  try {
    const bids = await Bid.find({ product: req.params.productId })
      .populate("bidder", "username") //
      .sort({ amount: -1 });

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;