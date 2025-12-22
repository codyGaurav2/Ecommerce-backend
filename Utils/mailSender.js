const nodemailer = require("nodemailer");
require('dotenv').config();

const sendMail = async(email,title,body) =>{
try{

    const transporter =  nodemailer.createTransport({

        host:process.env.MAIL_HOST,
        port: 587,
      secure: false,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS,
    
        },
    
    
    });

    const info = await transporter.sendMail({
        from:"Backend <no-reply@yourapp.com>",
        to:email,
        subject: title,
        text:body
    
    });
    console.log("Email sent:", info.messageId);
    

}catch(error){
    console.error("Email sending failed:", error);

}
};


module.exports = sendMail;



