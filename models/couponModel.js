import mongoose from 'mongoose'; 


const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
         
    },
   // code: String,
    discount: Number,
    expire: {
        type: Date,
        required: true 
    } 

});

export default mongoose.model('Coupon', couponSchema);