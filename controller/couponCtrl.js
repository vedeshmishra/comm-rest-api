import Coupon from "../models/couponModel.js";

import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongodbId.js";

// @route   GET /api/coupons
// @desc    Create coupon
const createCoupon = asyncHandler(async (req, res) => {
    
    const { name, expire, discount } = req.body;
    try {
        const coupon = await Coupon.create({
            name,
            expire,
            discount,
        });
        res.json(coupon);
    
        
    } catch (error) {
        
        throw new Error(error);
    } 

});

// deleteCoupon
const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const coupon = await Coupon.findByIdAndDelete(id);
        res.json( {msg:  " deleted successfully"});
    } catch (error) {
        throw new Error(error);
    }
});

// getCoupon
const getCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    res.json(coupon);
});

// getCoupons
 const getCoupons = asyncHandler(async (req, res) => {


    const coupons = await Coupon.find();
    res.json(coupons);
}
 );

 // updateCoupon
 const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    const { name, expiry, discount } = req.body;
    try {
        const coupon = await Coupon.findByIdAndUpdate(id, {
            name,
            expiry,
            discount,
        });
        res.json(coupon);
    } catch (error) {
        throw new Error(error);
    }


});





export { deleteCoupon, getCoupon, getCoupons, updateCoupon, createCoupon } ;