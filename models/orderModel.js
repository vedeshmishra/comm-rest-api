import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const orderSchema = new Schema({

    product:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    count:Number,
    color: String,

    }, ],
    paymentIntent:{},
    orderStatus:{
        type:String,
        default:"Not Processed",
        enum:["Not Processed","processing","Dispatched","Cash On Delivery", "Cancelled","Completed"]
    },
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User", 
    },



},{
    timestamps:true
});

export default mongoose.model('Order', orderSchema);