import express from "express";
import bodyParser from 'body-parser';
const app= express(); 
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
dotenv.config();
const PORT = process.env.PORT || 4000;
// database connecting
connectDB();

//body-parser
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) 

import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import blogRoute from "./routes/blogRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import blogCatRoute from "./routes/blogCatRoute.js";
import brandRoute from "./routes/brandRoute.js";
import colorRoute from "./routes/colorRoute.js";
import couponRoute from "./routes/couponRoute.js";

import cookieParser from "cookie-parser";
import morgan from "morgan";

app.use(morgan('dev'));

app.use(cookieParser());
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
app.use('/api/user', authRoute); 
app.use('/api/product', productRoute);
app.use('/api/blog', blogRoute); 
app.use('/api/category', categoryRoute); 
app.use('/api/blogcategory', blogCatRoute); 
app.use('/api/brand', brandRoute); 
app.use('/api/color', colorRoute); 
app.use('/api/coupon', couponRoute); 


app.use(notFound);
app.use(errorHandler);

// server
app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`)
});
