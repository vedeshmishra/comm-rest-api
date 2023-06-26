import express from "express";

const router = express.Router();
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";
import {
    createUser, loginUserCtrl, getAllUsers, getSingleUser, deleteUser, updateUser,
    blockUser, unblockUser, handleRefreshToken, logoutUserCtrl, updatePassword,
    forgotPasswordToken, resetPassword, adminLoginUserCtrl, getWishList, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus 
} from "../controller/userCtrl.js";


router.post('/register',  createUser);
router.post('/forgot-password-token', authMiddleware, forgotPasswordToken);
router.put('/update-password', authMiddleware, updatePassword);
router.put('/reset-password/:token', authMiddleware, resetPassword);

router.post('/login',  loginUserCtrl);
router.post('/admin-login',  adminLoginUserCtrl);
router.post('/cart', authMiddleware, userCart);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);
router.post('/cart/cash-order', authMiddleware,  createOrder);
router.get('/cart/my-orders', authMiddleware, getOrders);

router.put('/order/update-order-status', authMiddleware, updateOrderStatus);

router.get('/cart', authMiddleware, getUserCart);

router.put('/edit-user', authMiddleware, updateUser);
router.put('/address', authMiddleware, saveAddress);

router.get('/logout', logoutUserCtrl);

router.get('/wishlist', authMiddleware,  getWishList);

router.get('/:id', authMiddleware, isAdmin, getSingleUser);



router.get('/all-users', authMiddleware, isAdmin, getAllUsers);


router.delete('/empty-cart', authMiddleware, emptyCart);

router.delete('/:id', authMiddleware, isAdmin, deleteUser);

router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser); 
router.put('/refresh', handleRefreshToken); 



export default router;
