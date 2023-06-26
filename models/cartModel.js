import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
   
    products:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    count:Number,
    color: String,
    price:{
        type:Number, 
    },

    }, ],
    cartTotal:Number, 
    totalAfterDiscount:Number,
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User", 
    },
    couponApplied:{
        type:String,
        default:""
    
    },


},{
    timestamps:true
});

//Export the model
export default mongoose.model('Cart', cartSchema);

// module.exports = mongoose.model('Cart', cartSchema);