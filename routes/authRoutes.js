const express = require("express");

const { sendOtp } = require("../controllers/user");

const { signUp } = require("../controllers/user");

const router = express.Router();


router.post("/send-otp",sendOtp);
router.post("/signup",signUp);



module.exports = router;