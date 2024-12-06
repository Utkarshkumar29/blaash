const mongoose=require('mongoose')

const UserSchema =new mongoose.Schema({
    username:{
        type:String
    },
    email: { 
        type: String,
        unique: true,
        required: true
    },
    image:{
        type:String,
        default:"default.jpg"
    },
    password:{
        type:String,
    },
    otp: { type: String, default: null },
    otpExpiration: { type: Date, default: null },
})

module.exports = mongoose.model("User", UserSchema);