const express = require('express')
const db = require('./db')
const port = 3000;

const app = express();

app.listen(port, ()=>{
    console.log('server is running.')
})