import express from 'express';
import { authMiddleware, isAdmin} from '../middlewares/authMiddleware.js';

import  { addColor, updateColor, deleteColor, allColors, getColor } from '../controller/colorCtrl.js';



const router = express.Router();

router.get('/', authMiddleware, isAdmin, allColors);
router.get('/:id', authMiddleware, isAdmin, getColor);
router.post('/add', authMiddleware, isAdmin, addColor);
router.put('/update/:id', authMiddleware, isAdmin, updateColor);
router.delete('/delete/:id', authMiddleware, isAdmin, deleteColor);


export default router;