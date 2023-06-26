import express from 'express';
import { authMiddleware, isAdmin} from '../middlewares/authMiddleware.js';

import  { addBrand, updateBrand, deleteBrand, allBrands, getBrand } from '../controller/brandCtrl.js';



const router = express.Router();

router.get('/', authMiddleware, isAdmin, allBrands);
router.get('/:id', authMiddleware, isAdmin, getBrand);
router.post('/add', authMiddleware, isAdmin, addBrand);
router.put('/update/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/delete/:id', authMiddleware, isAdmin, deleteBrand);


export default router;