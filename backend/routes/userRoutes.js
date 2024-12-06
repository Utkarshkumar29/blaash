const { Login, SignUp, VerifyOtp } = require("../controllers/userControllers");
const express=require("express");

const router = express.Router();

router.route('/login').post(Login)
router.route('/verify-otp').post(VerifyOtp)
router.route('/signUp').post(SignUp)

module.exports = router;