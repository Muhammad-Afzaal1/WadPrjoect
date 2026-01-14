const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const User = require('./models/User');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const sellerRoutes = require('./routes/sellerRoutes')
const port = 3000;
const app = express();

app.use(bodyParser.json());


app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 
