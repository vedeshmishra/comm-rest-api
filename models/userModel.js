//const mongoose = require('mongoose'); // Erase if already required
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto"; 

//mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true}
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
       
    },
    lastname:{
        type:String,
        required:true,
       
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    isBlocked:{
        
        type:Boolean,
        default:false,
    },
    cart:{
        type:Array,
        
        default:[],
    },
    address: {
        type:String,
    },
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    }],
    refreshToken:{
        
        type:String,
        default:null,
        
    },
    passwordChangedAt:{
        type:Date, 
    },
    passwordResetToken:{
        type:String,
    },
    passwordResetExpires:{
        type:Date,
    }, 
},
{
    timestamps:true
},

);

 userSchema.methods.isPasswordMatched=async function(enteredPassword){  

    return await bcrypt.compare(enteredPassword, this.password);
 }


 userSchema.pre('save',async function(next){
    if (!this.isModified('password')) {
        next();
    } 
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);

})

userSchema.methods.createPasswordResetToken=async function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires=Date.now()+30*60*1000;//10 minutes
    return resetToken;
}


//Export the model
export default mongoose.model('User', userSchema); 