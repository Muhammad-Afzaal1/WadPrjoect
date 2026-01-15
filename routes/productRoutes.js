const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authenticateToken = require("../middleware/authenticateToken");
const isSeller = require('../middleware/isSeller');
const isProductOwner = require('../middleware/isProductOwner')


router.get("/", async (req, res) => {
  try {
    
    const products = await Product.find({ status: "enabled" });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
router.put("/:id", authenticateToken, isProductOwner, async (req, res) => {
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
router.delete("/:id", authenticateToken,isSeller, isProductOwner, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/status', authenticateToken,isSeller, isProductOwner,async(req, res)=>{
  try{
    const {status} = req.body
    if(!['enabled', 'disabled'].includes(status)){
      return res.status(400).json({ 
        message: "Invalid status. Must be 'enabled' or 'disabled'." 
      });
    }
    req.product.status = status;
    const updatedProduct = await req.product.save()

    res.status(200).json({ 
      message: `Product status updated to ${status}`, 
      product: updatedProduct 
    });
  }
  catch(err){
    res.status(500).json({error:err.message})
  }
})

module.exports = router;
