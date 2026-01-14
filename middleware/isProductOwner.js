const Product = require("../models/Product");

const isProductOwner = async(req, res, next)=>{
    try{
        const productId = req.params.id;
        const userId = req.user.id;

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }
        if(product.seller.toString() !== userId){
        return res.status(403).json({ 
            message: "Access denied. You do not own this product." 
        });
        }
        req.product = product;
        next();
    }catch(err){
        res.status(500).json({ error: "Server error during ownership verification" });
    }
}

module.exports = isProductOwner;