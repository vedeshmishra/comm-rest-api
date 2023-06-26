import express from 'express';
import { authMiddleware , isAdmin} from '../middlewares/authMiddleware.js';

import  { addBlogCategory, updateBlogCategory, deleteBlogCategory,
    allBlogCategories,getBlogCategory } from '../controller/blogCatCtrl.js';



const router = express.Router();

router.get('/', authMiddleware, isAdmin, allBlogCategories);
router.get('/:id', authMiddleware, isAdmin, getBlogCategory);

router.post('/add', authMiddleware, isAdmin, addBlogCategory);
router.put('/update/:id', authMiddleware, isAdmin, updateBlogCategory);
router.delete('/delete/:id', authMiddleware, isAdmin, deleteBlogCategory);


export default router;