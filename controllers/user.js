const User = require("../models/User");
const sendMail = require("../Utils/mailSender");
const bcrypt = require("bcrypt");
const Otp = require("../models/OTP");
const otpGenerator = require("otp-generator");
const sendSMS = require("../Utils/sendSms");
const { generateToken } = require("../Utils/JwtUtility");



exports.sendOtp = async(req,res) =>{
    try{
        //fetch
        const {email,phone} = req.body;

        if (!email && !phone) {
            return res.status(400).json({
              success: false,
              message: "Email or phone is required",
            });
          }

          const query = email ? {email} :{phone};
          const existingUser = await User.findOne({
            ...query,
            isVerified:true,
          });

          if (existingUser) {
            return res.status(400).json({
              success: false,
              message: "User already verified",
            });
          }
      
          //generate otp

          const otp = otpGenerator.generate(6,{
            digits:true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
          });

          //hash otp

          const otpHash = await bcrypt.hash(otp,10);

          //remove old otps from this identifier
          await Otp.deleteMany(query);

        //save otp
        await Otp.create({

        
        email:email || undefined,
        phone:phone || undefined,
        otpHash,
        expiresAt:new Date(Date.now() + 5 * 60 * 1000),


    });

   

    //send otp
if(email){
    await sendMail(
        email,
        "Your Otp Verification code",
        `Your OTP is ${otp}. It is valid for 5 min`
    );
}

if(phone){

       await sendSMS(phone, `Your OTP is ${otp}`);
}

res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });


    }catch(error){

        console.error("Send OTP error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to send OTP",
        });

    }
}

//Twilio (global, easiest) for sms like nodemailer for mail


exports.signUp = async(req,res) =>{
    try{

      //data fetch
      const {email,phone,otp} = req.body;
      if((!email && !phone)||!otp){
        return res.status(400).json({
          success: false,
          message: "Email or phone and OTP are required",
        });
      }

      //find valid otp

      const query = email? {email} : {phone};

      const otpRecord = await Otp.findOne({
        ...query,
        isUsed:false,
        expiresAt: { $gt: new Date() },
      });

      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: "OTP expired or invalid",
        });
      }

      //compare ot p because hashed

      const isOtpValid =  bcrypt.compare(Otp,otpRecord.otpHash);

      
    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

//mark otp as true
    otpRecord.isUsed = true;
    await otpRecord.save();

    //check if user already exist
    let user = await User.findOne(query);

    if(!user){

      user = await User.create({
        email:email|| undefined,
        phone:phone|| undefined,
        isVerified:true,
      });

    }else{

      user.isVerified = true,
      await user.save();
    }

    //jwt token
    const token = generateToken({
      id:user._id,
      role:user.role,
    });

    res.cookie("token",token,{
      httpOnly :true,
      secure: process.env.NODE_ENV ==="production",
      sameSite:"Strict",
      maxAge : 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

    }catch(error){
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        message: "Signup failed",
      });
  
    }
};

exports.login = async(req,res) =>{

  try{
    //fetch data
    const{ email,phone,otp } = req.body;
    if((!email && !phone) || !otp){
      return res.status(403).json({
        success:false,
        messgae:"Fill the details",
      })
    };
//check user already exist or not
    const query = email ? {email} : {phone};

    let existUser = await User.findOne(
  {
    ...query,
    isVerified:true,
  }
    );

    if(!existUser){
      return res.status(403).json({
        success:false,
        messgae:"User not found",
      });
    }

    //find valid otp

    const otpRecord = await Otp.findOne({
      ...query,
      isUsed:false,
        expiresAt: { $gt: new Date() },
    });

    
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or invalid",
      });
    }

    const isOtpValid =  await bcrypt.compare(Otp,otpRecord.otpHash);

    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //mark otp as true
    otpRecord.isUsed = true;
    await otpRecord.save();

const token = generateToken({
  id:existUser._id,
  role:existUser.role,
});

res.cookie("token",token,{
  httpOnly :true,
  secure: process.env.NODE_ENV ==="production",
  sameSite:"Strict",
  maxAge : 7 * 24 * 60 * 60 * 1000,
});

res.status(201).json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: existUser._id,
  email: existUser.email,
  phone: existUser.phone,
  role: existUser.role,
  },
});


  }catch(error){


    console.error("login error:", error);
    res.status(500).json({
      success: false,
      message: "login failed",
    });



  }
}