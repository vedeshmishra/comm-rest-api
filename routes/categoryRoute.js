import express from 'express';
import { authMiddleware , isAdmin} from '../middlewares/authMiddleware.js';

import  { addCategory,updateCategory, deleteCategory,allCategories,getCategory } from '../controller/categoryCtrl.js';



const router = express.Router();

router.get('/', authMiddleware, isAdmin, allCategories);
router.get('/:id', authMiddleware, isAdmin, getCategory);
router.post('/add', authMiddleware, isAdmin, addCategory);
router.put('/update/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/delete/:id', authMiddleware, isAdmin, deleteCategory);


export default router;