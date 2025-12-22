const mongoose = require("mongoose");


const otpSchema = new mongoose.Schema({

    email:{
        type:String,
        trim:true,
        index:true,
        sparse:true,
    },

    phone:{
        type:String,
        index:true,
        sparse:true,
    },
    otpHash:{
        type:String,
        required:true,
    },
    expiresAt:{
        type:Date,
        required:true,
    },
    isUsed:{
        type:Boolean,
        default:false,
    },
},
{timestamps:true}
);

//automatically deletes otp after expiry

otpSchema.index({expiresAt:1},{expiresAfterSeconds:0});

module.exports = mongoose.model("OTP",otpSchema);