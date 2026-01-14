const express = require('express');
const db = require('./db');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy; // Change this import style
const jwt = require('jsonwebtoken');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const User = require('./User');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(passport.initialize());



// 1. Fixed LocalStrategy Implementation
passport.use('local', new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
}));

const authenticateToken = (req, res, next)=>{
  const token = req.header('Authorization')?.replace('Bearer','')
  if(!token){
    res.status(403).jsone({"messaage":"Access denied. No token provided."})
  }
  jwt.verify()
} 

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});