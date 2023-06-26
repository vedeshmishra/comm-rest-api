import express from 'express';
import { createBlog, updateBlog, getAllBlogs, getSingleBlog, deleteBlog, likeBlog, dislikeBlog, uploadBlogImages } from '../controller/blogCtrl.js';

import {authMiddleware, isAdmin} from '../middlewares/authMiddleware.js';
import {blogImgResize, uploadImg } from '../middlewares/uploadImages.js';


const router = express.Router();

router.get("/", getAllBlogs)
router.get("/:id", getSingleBlog)
router.delete("/:id", authMiddleware, isAdmin, deleteBlog) 

router.post("/create-post", authMiddleware,isAdmin, createBlog)
router.put("/update-post/:id", authMiddleware, isAdmin, updateBlog) 

router.put("/upload/:id", authMiddleware, isAdmin, uploadImg.array("images", 10), blogImgResize, uploadBlogImages);

router.put("/like", authMiddleware, likeBlog)
router.put("/dislike", authMiddleware, dislikeBlog)

export default router;