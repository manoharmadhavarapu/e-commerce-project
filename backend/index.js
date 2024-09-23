// packages
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// utils
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// const __dirname = path.resolve(); //D:\NODEJS_PROJECTS\e-commerce

// app.use("/uploads", express.static(path.resolve() + "/uploads"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.listen(port, ()=>console.log(`Server running on port: ${port}`));