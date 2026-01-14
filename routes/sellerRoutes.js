// routes/sellerRoutes.js (or added to authRoutes.js)
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticateToken = require("../middleware/authenticateToken");

// POST /api/sellers/onboard
router.post("/onboard", authenticateToken, async (req, res) => {
  try {
    // req.user.id is populated by the authenticateToken middleware
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "seller" },
      { new: true }
    ).select("-password"); 
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Successfully onboarded as a seller",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;