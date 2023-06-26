import Product from "../models/productModel.js";
import slugify  from "slugify"; 

import asyncHandler from "express-async-handler";
import User from "../models/userModel.js"; 
import { cloudinaryUpload, cloudinaryDeleteImg } from "../utils/cloudinary.js"; 
import validateMongoDbId from "../utils/validateMongoDbId.js";
import fs from "fs";
const createProduct=asyncHandler(async(req,res)=>{
    try {
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
        const product=new Product(req.body);
        const savedProduct=await product.save();
        res.status(201).json({savedProduct, message:"Product added successfully", error:false}); 
        
    } catch (error) {
        throw new Error(error);
    }
});

//product update
const productUpdate=asyncHandler(async(req,res)=>{
    try {
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
        const product=await Product.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(201).json({product, message:"Product updated successfully", error:false}); 
        
    } catch (error) {
        throw new Error(error);
    }
});

//Delete a product
const deleteAProduct=asyncHandler(async(req,res)=>{
    try {
        const product=await Product.findByIdAndDelete(req.params.id);
        res.status(201).json({product, message:"Product deleted successfully", error:false}); 
              
    } catch (error) {
        throw new Error(error);
    }


});

// all products
const getProducts= asyncHandler(async(req,res)=>{ 
   // console.log(req.query)
    try {
       // const products=await Product.find(req.query);
       //const products=await Product.find({brand:req.query.brand, category:req.query.category});
      // const products=await Product.where("category").equals(req.query.category); 
      //filtering
      const queryObject= {...req.query}; 
      const excludedFields=["page","sort","limit","fields"];
     excludedFields.forEach(el=>delete queryObject[el]);
   // console.log(queryObject, req.query, excludedFields);
        let queryStr= JSON.stringify(queryObject);
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`);
        //console.log(JSON.parse(queryStr));

        let query = Product.find(JSON.parse(queryStr))

        //sorting
        if(req.query.sort){
            const sortBy=req.query.sort.split(",").join(" ");
            //console.log(sortBy)
            query.sort(sortBy);
        }else{
            query= query.sort("-createdAt");
        }
        //limiting the fields
        if(req.query.fields){
            const fields=req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }else{
            query= query.select("-__v");
        }

        //pagination
        const page=req.query.page
        const limit=req.query.limit
        const skip=(page-1)*limit;

        console.log(page, limit, skip);
        query= query.skip(skip).limit(limit);
        if (req.query.page) {
                const productCount= await Product.countDocuments();  
            if(skip>=productCount){
                throw new Error("This page does not exist");
            }         
        }
        

        
        const products=await query;
        res.json(products);
    }catch(error){
        
        throw new Error(error);
    } 
});
// get a products
const getAProduct= asyncHandler(async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id);
        res.json(product);
    }catch(error){
        throw new Error(error);
    }
}
);

// add to wish list
const addToWishList=asyncHandler(async(req,res)=>{
const {_id} = req.user 
    try {
        const user =await User.findById(_id);
        const alreadyAdded=await user.wishlist.find((userId)=>userId.toString() ===req.body.id);
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate(_id, {$pull: {wishlist: req.body.id}}, {new: true});
            res.json(user);

            }else{
                let user = await User.findByIdAndUpdate(_id, {$push: {wishlist: req.body.id}}, {new: true});
                res.json(user);
            }

        }catch(error){
        throw new Error(error);
    }
}

);

const rating = asyncHandler(async(req,res)=>{
    const {_id}=req.user;
    const {star, id, comment} = req.body
    const product = await Product.findById(id); 
    console.log(star);
    const alreadyRated=product.ratings.find((userId)=>userId.postedBy.toString() ===_id.toString());
    if(alreadyRated){
        let updateRating = await Product.updateOne(
            {
            ratings: {  $elemMatch: alreadyRated },
        }, 
        {
            $set: {"ratings.$.star": star, "ratings.$.comment": req.body.comment}
        },
        {new: true}
        );

        res.json(updateRating);
    
    }
    else{
        
        let rateProduct = await Product.findByIdAndUpdate(id, {
        $push: {
            ratings:{
                star:star, postedBy: _id, comment: comment
        },
    },
},

{new: true}
);


 //get all ratings
const allRatings = await Product.findById(id) 
let totalRating= allRatings.ratings.length;
let ratingSum = allRatings.ratings.map(rating=>rating.star).reduce((pre, curr)=>pre+curr, 0);
let actualRating = Math.round(ratingSum/totalRating);

let final_product = await( Product.findByIdAndUpdate(id, {totalRatings: actualRating},{new: true}))
res.json(final_product);

    }
}); 

// @uploadImages 
// @route /api/product/uploadImages
const uploadProductImages = asyncHandler(async(req, res)=>{
    
    try {
        const uploader =(path)=> cloudinaryUpload(path, "images");
        const url =[];
        const files= req.files;

        for(const file of files){
            const { path } = file;
            
            const newPath= await uploader(path);
            
        console.log(newPath)
            url.push(newPath); 
            fs.unlinkSync(path);
        }

        const images = url.map((file)=>{ 
            return file; 
        });
        
        res.json(images);

    }catch (error) {
        throw  new Error(error);
    }
}
);

const deleteProductImages = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    try {
        const uploader =(id)=> cloudinaryDeleteImg(id, "images");
        
        res.json({msg: "Deleted"});

    }catch (error) {
        throw  new Error(error);
    }
}
);

export  {
    createProduct, getProducts, getAProduct,
    deleteAProduct, productUpdate, addToWishList, 
    rating, uploadProductImages, deleteProductImages
};
