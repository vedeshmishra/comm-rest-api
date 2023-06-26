import Blog from "../models/blogModel.js"; 
import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongoDbId.js"; 
import * as fs from 'fs';
import {cloudinaryUpload} from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {

    try {
        const newBlog = await Blog.create(req.body);
        res.json({newBlog, status:'success'});
        
    } catch (error) {
        throw new Error(error);
    } 

}); 

const updateBlog = asyncHandler(async (req, res) => {

    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog) return res.status(404).json({message:'Blog not found'});

      // if(blog.user.toString() !== req.user.id) return res.status(401).json({message:'Unauthorized'});

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.json({updatedBlog, status:'success'});
        
    } catch (error) {
        throw new Error(error);
    } 



});

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        throw new Error(error);
    }
});

const getSingleBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('likes').populate('dislikes');
        await Blog.findByIdAndUpdate(req.params.id, {$inc: {viewCount: 1}});
        res.json(blog);
        if(!blog) return res.status(404).json({message:'Blog not found'});
    }catch (error) {
        throw new Error(error);
    }
    
});

const deleteBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog) return res.status(404).json({message:'Blog not found'});
        await Blog.findByIdAndDelete(req.params.id);
        res.json({message:'Blog deleted successfully'});
    }catch (error) {
        throw new Error(error);
    }
    
});

const likeBlog = asyncHandler(async (req, res) => {
    try {
         
        validateMongoDbId(req.body.id);

        //find the blog which you want to be liked
        const blog = await Blog.findById(req.body.id);
        if(!blog) return res.status(404).json({message:'Blog not found'});
//find logged in user
const loginUserId = req?.user?.__id;
//check if the user has liked the blog
const isLiked = blog?.isLiked
// find if the user has disliked the blog
const alreadyDisliked = blog?.dislikes?.find((userId)=>userId?.toString()===loginUserId?.toString());
if(alreadyDisliked){
    await Blog.findByIdAndUpdate(req.body.id, { $pull:{dislikes:loginUserId}, isDisliked:false },{new:true});
}

if(isLiked){
    await Blog.findByIdAndUpdate(req.body.id, { $pull:{likes:loginUserId}, isLiked:false },{new:true});
}else{
    await Blog.findByIdAndUpdate(req.body.id, { $push:{likes:loginUserId}, isLiked:true },{new:true}); 
}

       
        res.json({data: blog, message:'Blog liked successfully'});
    }catch (error) {
        throw new Error(error);
    }
    
}

);



const dislikeBlog = asyncHandler(async (req, res) => {
    try {
         
        validateMongoDbId(req.body.id);

        //find the blog which you want to be liked
        const blog = await Blog.findById(req.body.id);
        if(!blog) return res.status(404).json({message:'Blog not found'});
//find logged in user
const loginUserId = req?.user?.__id;
//check if the user has liked the blog
const isDisliked = blog?.isDisliked
// find if the user has disliked the blog
const alreadyLiked = blog?.likes?.find((userId)=>userId?.toString()===loginUserId?.toString());
if(alreadyLiked){
    await Blog.findByIdAndUpdate(req.body.id, { $pull:{likes:loginUserId}, isLiked:false },{new:true});
}

if(isDisliked){
    await Blog.findByIdAndUpdate(req.body.id, { $pull:{dislikes:loginUserId}, isDisliked:false },{new:true});
}else{
    await Blog.findByIdAndUpdate(req.body.id, { $push:{dislikes:loginUserId}, isDisliked:true },{new:true}); 
}

       
        res.json({data: blog, message:'Blog disliked successfully'});
    }catch (error) {
        throw new Error(error);
    }
    
}

);

const uploadBlogImages = asyncHandler(async (req, res) => {
    
    const { id } = req.params;
    
    validateMongoDbId(id);
    try {
                
        const uploader =(path)=> cloudinaryUpload(path, "images");
        const url =[];
        const files= req.files; 
        for(const file of files){
            const { path } = file;
            
            const newPath= await uploader(path);
            
            url.push(newPath); 
            fs.unlinkSync(path);
        }

        //find blog and update images
        const findblog = await Blog.findByIdAndUpdate(
            id, 
            {images: url.map((file)=>{return file;})},
        {new: true}
        );
        
        res.json(findblog);

    }catch (error) {
        throw  new Error(error);
    }
}
);



export {createBlog, updateBlog, getAllBlogs, getSingleBlog, deleteBlog, likeBlog, dislikeBlog, uploadBlogImages };
