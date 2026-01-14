const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()

router.get('/', async(req, res)=>{
    res.send('hello, world')
})

router.post('/register', async(req, res)=>{
    try{
        const {username, email, password, password2} = req.body;
        if(password!== password2){
            res.status(403).json({error:"Passwords don't match"});
        }
        

    }
})

module.exports = router