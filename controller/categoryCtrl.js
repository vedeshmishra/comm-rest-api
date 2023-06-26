import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import validateMongoDbId from "../utils/validateMongoDbId.js"; 


// Category CRUD for Products
// @route   POST /api/category/add
// @desc    Add a new category

const addCategory = asyncHandler(async(req, res)=>{


    try {
        const addCategory = await Category.create(req.body);
        res.json({addCategory, status:'success'});
        
    } catch (error) {
        throw new Error(error);
    } 

});

// @route   PUT /api/category/update
// @desc    Update a category

const  updateCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const category = await Category.findById(id);
        if(!category){
            res.status(404);
            throw new Error('Category not found');
        }
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {new:true});
        res.json({updatedCategory, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 
});

// @route   DELETE /api/category/delete

// @desc    Delete a category

const deleteCategory = asyncHandler(async(req, res)=>{

    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const category = await Category.findById(id);
        if(!category){
            res.status(404);
            throw new Error('Category not found');
        }
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json({deletedCategory, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 


});

// @route   GET /api/category/all
// @desc    Get all categories

const allCategories = asyncHandler(async(req, res)=>{
        try {
        const categories = await Category.find({});
        res.json({categories, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 

});

// @route   GET /api/category/:id
// @desc    Get a category
const getCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const category = await Category.findById(id);
        if(!category){
            res.status(404);
            throw new Error('Category not found');
        }
        res.json({category, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 






});


export {addCategory, updateCategory, deleteCategory, allCategories, getCategory};