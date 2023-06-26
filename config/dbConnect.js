import mongoose from "mongoose";
 
const connectDB = async () => {
    try {
        // mongoose.set('useFindAndModify', false); mongoose.set('strictQuery', true); 
        await mongoose.connect(process.env.MONGODB_URL);

        // print mongoose logs in dev env
        
           // mongoose.set('debug', true)
        

        console.log('connected to mongoDB'); 
    } catch (err) {
        console.log('error connecting to mongoDB: ', err);
    }
};

export default connectDB;
