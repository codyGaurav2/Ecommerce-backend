const mongoose = require("mongoose");

require("dotenv").config();


exports.connectDB = async() =>{
    try{
        //CONNECT TO DB
       await mongoose.connect(process.env.MONGO_URL);
        console.log("db connection successfull");

    }catch(error){

        console.log("db fail");
        process.exit(1);//process.exit(1) immediately stops your Node.js program and tells the operating system that it failed.



    }
}