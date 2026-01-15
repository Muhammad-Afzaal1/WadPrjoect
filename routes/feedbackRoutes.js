const express = require('express')
const router = express.Router();
const FeedBack = require('../models/Feedback');
const authenticateToken = require('../middleware/authenticateToken')
const Product = require('../models/Product');
const Order = require('../models/Order')
router.post('/',authenticateToken, async(req, res)=>{
    try{
        const {productId, rating, comment} = req.body;
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }
        const hasOrdered = await Order.findOne({
            buyer:req.user.id,
            product:productId,
            status:'completed'
        })

        if (!hasOrdered) {
            return res.status(403).json({ message: "You can only review products you have purchased." });
        }

        const feedback = new FeedBack({
            reviewer: req.user.id, 
            seller: product.seller,
            product: productId,
            rating,
            comment
        });

        await feedback.save();
        res.status(201).json({ message: "Feedback submitted successfully", feedback });

    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.get("/:sellerId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ seller: req.params.sellerId })
      .populate("reviewer", "username") 
      .populate("product", "name")     
      .sort({ createdAt: -1 });

    const total = feedbacks.reduce((acc, item) => acc + item.rating, 0);
    const average = feedbacks.length > 0 ? (total / feedbacks.length).toFixed(1) : 0;

    res.json({
      sellerId: req.params.sellerId,
      averageRating: parseFloat(average),
      totalReviews: feedbacks.length,
      reviews: feedbacks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;