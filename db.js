const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/ebay'
mongoose.connect(url);
const db = mongoose.connection
db.on('connected',()=>{console.log('MongoDB is connected')})
db.on('error',()=>{console.log('MongoDB connection error')})
db.on('disconnected',()=>{console.log('MongoDB is didconnected')})
module.exports = db
