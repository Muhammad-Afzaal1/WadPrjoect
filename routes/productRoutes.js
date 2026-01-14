const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST /api/products → Create product listing with images and seller 
router.post('/', async (req, res) => {
    try {
        const { name, description, price, quantity, category, seller, images } = req.body;
        
        const newProduct = new Product({
            name,
            description,
            price,
            quantity,
            category,
            seller, // The ID of the user creating the product
            images  // Expecting an array of strings (URLs)
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /api/products/:id → Get product with seller details populated 
router.get('/:id', async (req, res) => {
    try {
        // .populate('seller') allows us to see the user's name/email instead of just an ID
        const product = await Product.findById(req.params.id).populate('seller', 'username email');
        
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/* UPDATE PRODUCT */
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json({ message: 'Product updated', product })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

/* DELETE PRODUCT */
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
