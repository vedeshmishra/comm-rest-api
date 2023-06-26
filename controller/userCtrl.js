import generateToken from "../config/jwtToken.js";
import generateRefreshToken from "../config/refreshToken.js";
import crypto from "crypto";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Coupon from "../models/couponModel.js";
import Cart from "../models/cartModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongoDbId.js"; 
import * as jwt from 'jsonwebtoken';
import sendEmail from "./emailCtrl.js";
import Order from "../models/orderModel.js";
import uniqid from "uniqid";


const createUser = asyncHandler(async(req, res) => { 
    const   email  = req.body.email;
    let findUser = await User.findOne({ email });
    if (!findUser) {
        const user = await User.create(req.body);
        res.json({ message: "User created!", success: true });
         
    }else{
      throw new Error("User already exists!");
    }
        
}   
);
//login user
const loginUserCtrl = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.isPasswordMatched(password))){
        const refreshToken = generateRefreshToken(user._id);
     const updateUser = await User.findByIdAndUpdate(user._id, {refreshToken:refreshToken },{new:true});

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 72 * 60 * 60 * 1000,
        });
        
        const userdata = {
            _id: user?._id,
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
            mobile: user?.mobile, 
            role:user?.role,
            token: generateToken(user._id)

        };
        res.json({data: userdata, message: "Login Successful", success: true});
    }else{
        throw new Error("Invalid Email or Password");
    }
})


//admin login user
const adminLoginUserCtrl = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    const userAdmin = await User.findOne({email});

    if(userAdmin.role !== 'admin') throw new Error("not Authorized");

    if(userAdmin && (await userAdmin.isPasswordMatched(password))){
        const refreshToken = generateRefreshToken(userAdmin._id);
     const updateUser = await User.findByIdAndUpdate(userAdmin._id, {refreshToken:refreshToken },{new:true});

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 72 * 60 * 60 * 1000,
        });
        
        const userAdminData = { 
            _id: userAdmin?._id,
            firstname: userAdmin?.firstname,
            lastname: userAdmin?.lastname,
            email: userAdmin?.email,
            mobile: userAdmin?.mobile, 
            role:userAdmin?.role,
            token: generateToken(userAdmin._id)

        };
        res.json({data: userAdminData, message: "Login Successful", success: true});
    }else{
        throw new Error("Invalid Email or Password");
    }
})


//logout user
const logoutUserCtrl = asyncHandler(async(req, res) => { 
    const cookies= req.cookies
    //console.log("first")
   
    if (!cookies?.refreshToken) throw new Error("no refresh Token in cookies"); 
    const refreshToken = cookies.refreshToken;
    const user = await User.findOne({ "refreshToken":refreshToken });
    //console.log(user)
    if (!user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true, 
        });
        return res.sendStatus(204);     
    }           // for bidden
     await User.findOneAndUpdate(refreshToken, { refreshToken: "" } );
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true, 
        maxAge: 0,
    }); 
    return res.sendStatus(204);   
});



// handle Refresh Token
const handleRefreshToken = asyncHandler(async(req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) throw new Error("no refresh Token in cookies"); 
    const refreshToken = cookies.refreshToken;
     

    const user = await User.findOne({ refreshToken });
     
    if (!user) throw new Error("no refresh Token in cookies"); 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.JWT_SECRET,
        (err, decoded) => {
            if (err || user?._id.toString() !== decoded.id) return res.sendStatus(403);
            const accessToken = generateToken(user._id);
            res.json({ accessToken });
        }
    );



})


//update user
const updateUser = asyncHandler(async(req, res) => {
    try {
        const {_id}=req.user
        validateMongoDbId(_id);
        const user = await User.findByIdAndUpdate(_id, req.body);
        res.json({data: user, message: "User updated", success: true});
        
    }  
     catch (error) {
        throw new Error(error);
    }
});
// @userRoute  /api/users/save-address
const saveAddress = asyncHandler(async(req, res) => {
    try {
        const {_id}=req.user

        validateMongoDbId(_id);
        const user = await User.findByIdAndUpdate(_id, {address: req.body.address});
        res.json({data: user, message: "Address saved", success: true});
        
    }  
     catch (error) {
        throw new Error(error);
    }
});

//all user
const getAllUsers = asyncHandler(async(req, res) => {

    try {
        const allUsers = await User.find({}).select("-password");
    res.json({data: allUsers, success: true});
    } catch (error) {
       throw new Error(error);
    }
});

//get a single user data
const getSingleUser = asyncHandler(async(req, res) => {
    try {
        //console.log(req.params)
        const { id }=req.params;
        validateMongoDbId(id);
        const user = await User.findById(id).select("-password");
        res.json({data: user, success: true});
        
    }  
     catch (error) {
        throw new Error(error);
    }
});


// delete a user    

const deleteUser = asyncHandler(async(req, res) => {
    try {
        const {id}=req.params
        validateMongoDbId(id);
        const user = await User.findByIdAndDelete(id);
        res.json({data: user, message: "User deleted", success: true});
        
    }  
     catch (error) {
        throw new Error(error);
    }
}   
);

//blockUser
const blockUser = asyncHandler(async(req, res) => {
    try {
        const {id}=req.params
        validateMongoDbId(id);
        const user = await User.findByIdAndUpdate(id, {isBlocked: true});
        res.json({ message: "User blocked", success: true});
        
    }  
     catch (error) {
        throw new Error(error);
    }
}

);
//unblockUser
const unblockUser = asyncHandler(async(req, res) => {
    try {
        const {id}=req.params
        validateMongoDbId(id);
        const user = await User.findByIdAndUpdate(id, {isBlocked: false});
        res.json({ message: "User unblocked", success: true});
        
    }  
     catch (error) {
        throw new Error(error);
    }
}

);

const updatePassword = asyncHandler(async(req, res) => {
    try {
        const {_id}=req.user
        validateMongoDbId(_id);
        const user = await User.findById(_id);
        user.password = req.body.password;
      const updatePassword = await user.save();
        res.json({data: updatePassword, message: "User updated", success: true});
        
    }  
     catch (error) {
        throw new Error(error);
    }
}

); 

const forgotPasswordToken = asyncHandler(async(req, res) => {
    console.log(req.body)
    const {email} = req.body;
    const user = await User.findOne(email)
    if (!user) throw new Error("User not found");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `http://localhost:3000/api/user/reset-password/${token}`;
        const link = `please, follow this link to reset your password this link is valid for 10 minutes from now <a href=${resetUrl}>Click Here</a>` 
        const data={
            to: 'ved170503@gmail.com',
            text: "Hello User",
            subject: "Password Reset",
            html: link,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    } 

    });

    const resetPassword = asyncHandler(async(req, res) => {

        const { password }= req.body;
        const { token } = req.params;
        const hashedToken =  crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
            }
        );
        if (!user) throw new Error("Token is invalid or has expired, Please try again later");
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        res.json({user:user, message: "Password updated", success: true});

    });

    // all wishlist
    const getWishList = asyncHandler(async(req, res) => {

        const {_id} = req.user; 
        try {

            const findUser = await User.findById(_id).populate('wishlist');

            res.json({data: findUser, success: true});
        }
         catch (error) {
            throw new Error(error);
        
            
        }

    });

    // cart functionality
    const userCart = asyncHandler(async(req, res) => {
        const {_id} = req.user; 
        const { cart } = req.body;
        validateMongoDbId(_id);
        try {
let products =[];
            const findUser = await User.findById(_id);
            // check if user have product in cart already
            const isProductInCart = Cart.find({orderBy:findUser._id});
            if (isProductInCart) {
                isProductInCart.findOneAndRemove();
              //  throw new Error("Product is already in cart");
            }
            for (let index = 0; index < cart.length; index++) {
                
                let object = {};
                object.product = cart[index]._id;
                object.count = cart[index].count;
                object.color = cart[index].color;
                let getPrice = await Product.findById(cart[index]._id).select('price').exec();
                object.price = parseInt(getPrice?.price);
                products.push(object);
                
            }
            

            let cartTotal =0;
            for (let index = 0; index < products.length; index++) {
                cartTotal += products[index].price * products[index].count;

            }

            // create a new cart
            let newCart = new Cart({
                products,
                        cartTotal,
                        orderBy: _id
                        }).save();
            res.json({ newCart, success: true});
        
        }
        catch (error) {
            throw new Error(error);
        
            
        } 

    });

    const getUserCart = asyncHandler(async(req, res) => {
        const {_id} = req.user; 
        validateMongoDbId(_id);
        try {
            const cart = await Cart.findOne({orderBy: _id}).populate('products.product'); 
            res.json({data: cart, success: true});
            
        }catch (error) {
            throw new Error(error);
        }

    });

    // empty cart
    const emptyCart = asyncHandler(async(req, res) => {
        const {_id} = req.user; 
        validateMongoDbId(_id);
        try {
            const user = await User.findOne({_id});
            const cart = await Cart.findOneAndRemove({orderBy: user._id});
            res.json({data: cart, msg: "Empty cart for the User", success: true});              
        }catch (error) {
            throw new Error(error);
        }  


    });

    const applyCoupon = asyncHandler(async(req, res) => {

        const { coupon }= req.body;
        const { _id } = req.user;
        try {
            const validCoupon = await Coupon.findOne({name: coupon}).exec();
            if (validCoupon=== null) {
                throw new Error("Invalid coupon");
            }
            const user = await User.findOne({_id});
            let {product, cartTotal} = await Cart.findOne({orderBy: user._id}).populate('products.product').exec();
            let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2);
            await Cart.findOneAndUpdate({orderBy: user._id}, {totalAfterDiscount, couponApplied: validCoupon._id},{new: true});

            res.json({totalAfterDiscount,cartTotal,  success: true});

            
        }catch (error) {
            throw new Error(error);
        }
        

    });


    // create order
    const createOrder = asyncHandler(async(req, res) => {
        const {_id} = req.user; 
       
        validateMongoDbId(_id);

        const {COD, couponApplied} = req.body;

        if(!COD) throw new Error("Create Cash Order Delivery Failed "); 

        try {
            const user = await User.findOne({_id});
            const {cartTotal, totalAfterDiscount, couponApplied} = await Cart.findOne({orderBy: user._id}).exec();
            const userCart = await Cart.findOne({orderBy: user._id});
            let newOrder = new Order({
                totalPrice: cartTotal,
                totalAfterDiscount, 
                orderBy: user._id,
                products: user.cart.products,
                paymentIntent: {
                    id:uniqid(),
                    method:"COD",
                    amount: cartTotal,
                    status: "Cash On Delivery",
                    created: Date.now(),
                    currency: "INR", 
                },
                orderStatus: "Cash On Delivery",
                
            }).save();

            let update = await userCart.products.map(async(item) => {

                return {

                    updateOne: {
                        filter: {_id: item.product._id}, 
                        update: {$inc: {quantity: -item.count, sold: +item.count}},
                    
                },
            };
            });

            const updated = await Product.bulkWrite(update, {});

            res.json({ success: true});
            
        }catch (error) {
            throw new Error(error);
        }

    
    });
 

//getOrders
const getOrders = asyncHandler(async(req, res) => {
    const {_id} = req.user; 
    validateMongoDbId(_id);
    try {
        const order = await Order.find({orderBy: _id}).populate('products.product').exec(); 
        res.json({data: order, success: true});
        
    }catch (error) {
        throw new Error(error);
    }
    

});

const updateOrderStatus = asyncHandler(async(req, res) => {
    const {_id} = req.user; 
    const {orderId, orderStatus} = req.body;
    validateMongoDbId(_id);
    try {
        const order = await Order.findByIdAndUpdate(orderId, {orderStatus:orderStatus, paymentIntent: {status: orderStatus}},{new: true}); 
        res.json({data: order, success: true});
        
    }catch (error) {
        throw new Error(error);
    }
    

});
    

export  {
    createUser, loginUserCtrl, adminLoginUserCtrl,
    getAllUsers, getSingleUser,
    deleteUser, updateUser, 
    blockUser, unblockUser, 
    handleRefreshToken,
    logoutUserCtrl,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    getWishList,saveAddress, userCart, getUserCart, emptyCart, applyCoupon,createOrder,getOrders, updateOrderStatus,
    };