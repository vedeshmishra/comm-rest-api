import express from 'express';
import {authMiddleware,
    isAdmin, } from '../middlewares/authMiddleware.js'; 

 
import { deleteCoupon, getCoupon, getCoupons, updateCoupon, createCoupon } from '../controller/couponCtrl.js';
const router = express.Router();

router.get('/', getCoupons);

router.get('/:id', getCoupon);

router.post('/', authMiddleware, isAdmin, createCoupon);

router.put('/:id', authMiddleware, isAdmin, updateCoupon);

router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);

export default router;



