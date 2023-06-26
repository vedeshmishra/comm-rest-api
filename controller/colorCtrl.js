import asyncHandler from "express-async-handler";
import Color from "../models/colorModel.js";
import validateMongoDbId from "../utils/validateMongoDbId.js"; 


// Color CRUD for Products
// @route   POST /api/Color/add
// @desc    Add a new Color

const addColor = asyncHandler(async(req, res)=>{


    try {
        const addColor = await Color.create(req.body);
        res.json({addColor, status:'success'});
        
    } catch (error) {
        throw new Error(error);
    } 

});

// @route   PUT /api/Color/update
// @desc    Update a Color

const  updateColor = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const color = await Color.findById(id);
        if(!color){
            res.status(404);
            throw new Error('Color not found');
        }
        const updatedColor = await Color.findByIdAndUpdate(id, req.body, {new:true});
        res.json({updatedColor, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 
});

// @route   DELETE /api/Color/delete

// @desc    Delete a Color

const deleteColor = asyncHandler(async(req, res)=>{

    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const color = await Color.findById(id);
        if(!color){
            res.status(404);
            throw new Error('Color not found');
        }
        const deletedColor = await Color.findByIdAndDelete(id);
        res.json({deletedColor, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 


});

// @route   GET /api/Color/all
// @desc    Get all categories

const allColors = asyncHandler(async(req, res)=>{
        try {
        const colors = await Color.find({});
        res.json({colors, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 

});

// @route   GET /api/Color/:id
// @desc    Get a Color
const getColor = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const color = await Color.findById(id);
        if(!color){
            res.status(404);
            throw new Error('Color not found');
        }
        res.json({color, status:'success'}); 
    } 
    catch (error) {
        throw new Error(error);
    
    } 






});


export {addColor, updateColor, deleteColor, allColors, getColor};