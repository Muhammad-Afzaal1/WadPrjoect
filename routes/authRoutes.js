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



module.exports = router