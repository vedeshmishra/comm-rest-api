import asyncHandler from "express-async-handler";
import blogCategory from "../models/blogCatModel.js";
import validateMongoDbId from "../utils/validateMongoDbId.js"; 


// Category CRUD for Products
// @route   POST /api/category/add
// @desc    Add a new category

const addBlogCategory = asyncHandler(async(req, res)=>{


    try {
        const addBlogCategory = await blogCategory.create(req.body);
        res.json({addBlogCategory, status:'success'});
        
    } catch (error) {
        throw new Error(error);
    } 

});

// @route   PUT /api/category/update
// @desc    Update a category

const  updateBlogCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const blogcategory = await blogCategory.findById(id);
        if(!blogcategory){
            res.status(404);
            throw new Error('Category not found');
        }
        const updatedCategory = await blogCategory.findByIdAndUpdate(id, req.body, {new:true});
        res.json({updatedCategory, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 
});

// @route   DELETE /api/category/delete

// @desc    Delete a category

const deleteBlogCategory = asyncHandler(async(req, res)=>{

    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const category = await blogCategory.findById(id);
        if(!category){
            res.status(404);
            throw new Error('Category not found');
        }
        const deletedCategory = await blogCategory.findByIdAndDelete(id);
        res.json({deletedCategory, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 


});

// @route   GET /api/category/all
// @desc    Get all categories

const allBlogCategories = asyncHandler(async(req, res)=>{
        try {
        const categories = await blogCategory.find({});
        res.json({categories, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 

});

// @route   GET /api/category/:id
// @desc    Get a category
const getBlogCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const blogCatData = await blogCategory.findById(id);
        if(!blogCatData){
            res.status(404);
            throw new Error('blogCategory not found');
        }
        res.json({blogCatData, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 






});


export {addBlogCategory, updateBlogCategory, deleteBlogCategory, allBlogCategories, getBlogCategory};