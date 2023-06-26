import mongoose from "mongoose";
const validateMongoDbId = (_id) => {
const isValid =mongoose.Types.ObjectId.isValid(_id);
  if (!isValid) {
    throw new Error("Invalid ID or Not found");
   
  } 
}

export default validateMongoDbId;