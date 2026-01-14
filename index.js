const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const User = require('./models/User');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const port = 3000;
const app = express();

app.use(bodyParser.json());


app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 