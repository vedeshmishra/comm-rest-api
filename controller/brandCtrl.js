import asyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";
import validateMongoDbId from "../utils/validateMongoDbId.js"; 


// Brand CRUD for Products
// @route   POST /api/Brand/add
// @desc    Add a new Brand

const addBrand = asyncHandler(async(req, res)=>{


    try {
        const addBrand = await Brand.create(req.body);
        res.json({addBrand, status:'success'});
        
    } catch (error) {
        throw new Error(error);
    } 

});

// @route   PUT /api/Brand/update
// @desc    Update a Brand

const  updateBrand = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const brand = await Brand.findById(id);
        if(!brand){
            res.status(404);
            throw new Error('Brand not found');
        }
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {new:true});
        res.json({updatedBrand, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 
});

// @route   DELETE /api/Brand/delete

// @desc    Delete a Brand

const deleteBrand = asyncHandler(async(req, res)=>{

    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const brand = await Brand.findById(id);
        if(!brand){
            res.status(404);
            throw new Error('Brand not found');
        }
        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.json({deletedBrand, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 


});

// @route   GET /api/Brand/all
// @desc    Get all categories

const allBrands = asyncHandler(async(req, res)=>{
        try {
        const brands = await Brand.find({});
        res.json({brands, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 

});

// @route   GET /api/Brand/:id
// @desc    Get a Brand
const getBrand = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const brand = await Brand.findById(id);
        if(!brand){
            res.status(404);
            throw new Error('Brand not found');
        }
        res.json({brand, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 






});


export {addBrand, updateBrand, deleteBrand, allBrands, getBrand};