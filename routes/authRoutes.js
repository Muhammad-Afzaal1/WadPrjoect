const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const User = require('../models/User')
router.get('/', async(req, res)=>{
    res.send('hello, world')
})



router.post('/register', async(req, res)=>{
    try{
        const {username, email, password, password2} = req.body;
        if(password!== password2){
            res.status(403).json({error:"Passwords don't match"});
        }
        const user = new User({
            username, email, password
        })
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    }
    catch(err){
        res.status(400).json({error:err.message})
    }
})

router.post('/login', async(req, res)=>{
    try{   
        const {email, password} = req.body;
        const user = await User.findOne({email:email})
        if(!user){
            res.status(401).json({error:"User with this email doesn't exist"})
        }
        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            res.status(401).json({error:"Incorrect password"})
        }
        const payload= {
            id:user._id,
            email:email,
            role:user.role
        }
        const token = jwt.sign(payload,"123", {expiresIn:"1h"})
        res.status(201).json({"token":token, user:payload});
    }
    catch(err){
        res.status(500).json({"error":err.message});
    }
})


module.exports = router