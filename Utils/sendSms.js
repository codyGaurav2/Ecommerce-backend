const twilio = require("twilio");
require('dotenv').config();
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILLIO_AUTH_TOKEN

);

const sendSMS = async(phone,message) =>{
    try{

        const response = await client.messages.create({
            body:message,
            from:process.env.TWILIO_PHONE_NUMBER,
            to:phone,

        });
         console.log("SMS sent:", response.sid);

    }catch(error){

        console.error("SMS sending failed:", error);
    throw error;

    }
}

module.exports = sendSMS;