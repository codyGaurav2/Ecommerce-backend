const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({

   
    
    email:{
        type:String,
        unique:true,//check uniqueness if exist or didnt exist one of them the also works but if any exist must be unique
        sparse:true,
        trim:true,
        
    },
    phone:{
        type:String,
        unique:true,
        sparse:true,
      
    },

    isVerified:{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        enum: ["customer", "seller", "admin"],
        default: "customer",

    },
    // to block user in future deleting will cause problem because order history payemnet etc will also be deleted so just block user

    status:{
        type:String,
        enum:["Active","Blocked"],
        default:"Active",
    },  
},
{timeStamps:true}
);

module.exports = mongoose.model("User",userSchema);