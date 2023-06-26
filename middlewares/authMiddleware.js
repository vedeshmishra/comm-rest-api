
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const authMiddleware= asyncHandler(async (req,res,next)=>{
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded)
        req.user = await User.findById(decoded?.id);
        next();
    } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
   } else{
    throw new Error("Not authorized, no token attached to header");
   }
    
   
});

const isAdmin = asyncHandler(async(req, res, next) => {
    if (req.headers.authorization){ 
      
              const { email } = req.user;
              const adminUser = await User.findOne({email});
                  if (adminUser.role!=="admin") {
                    res.status(401);
                    throw new Error("Not authorized as an admin");
                  } else {
                    next();
                  } 
           
    }else {
        res.status(401);
        throw new Error("Not authorized, no token attached to header");
      }
      
  });

export {
    authMiddleware,
    isAdmin,
};

