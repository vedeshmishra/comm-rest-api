import express from 'express';
import {authMiddleware,
    isAdmin, } from '../middlewares/authMiddleware.js'; 
import { 
    createProduct, getProducts,  getAProduct, productUpdate, deleteAProduct,
    addToWishList, rating, uploadProductImages, deleteProductImages
} from '../controller/productCtrl.js';
import { uploadImg, productImgResize } from '../middlewares/uploadImages.js';
const router = express.Router();


router.get('/products', getProducts);
//wishlist
router.put('/add-to-wishlist', authMiddleware, addToWishList);
router.put('/rating', authMiddleware, rating);

router.get('/:id',  getAProduct);

router.delete('/:id',authMiddleware, isAdmin,  deleteAProduct);
router.delete('/delete-image/:id',authMiddleware, isAdmin,  deleteProductImages);

router.post('/create-product', authMiddleware, isAdmin,  createProduct);
router.put("/upload/", authMiddleware, isAdmin, uploadImg.array("images", 10), productImgResize, uploadProductImages);
router.put('/update-product/:id', authMiddleware, isAdmin,  productUpdate);




export default router;