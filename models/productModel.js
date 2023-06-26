import mongoose from  'mongoose';

const productSchema = mongoose.Schema({ 
    title: {
        type: String,
        required: true,
        trim: true,
        },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,

    },
    category:{
        type: String,
        required: true,
        },
    brand:{
            type: String,
            required: true,
        },
    quantity:{
         type: Number,
         required: true,
    },
    sold:{
        type:Number,
        default:0, 
    },
    images:[],
    color:[],
    tags:[],
    ratings:[{
        star:Number,
        comment:String,
        postedBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    }], 
    totalRatings:{
        type: Number,
        default: 0,
    },



    },  {   timestamp: true, }
    
    );


    export default mongoose.model('Product', productSchema);