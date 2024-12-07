
const bcrypt = require('bcryptjs')
const UserSchema = require('../models/userModel')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const path=require('path')
const fs = require('fs')
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.DEV_MAIL,
      pass: process.env.DEV_MAIL_KEY
    }
  })

  const Login = async (req, res) => {
    const { email, password } = req.body
    try {
        const userDocs = await UserSchema.findOne({ email })
        if (userDocs) {
            const passOk = bcrypt.compareSync(password, userDocs.password)
            if (passOk) {
                const otp = generateOTP()

                const otpExpiration = new Date()
                otpExpiration.setMinutes(otpExpiration.getMinutes() + 10)

                userDocs.otp = otp
                userDocs.otpExpiration = otpExpiration
                await userDocs.save()

                const emailTemplatePath = path.join(__dirname, '../template/otpTemplate.html')
                fs.readFile(emailTemplatePath, 'utf-8', async (err, data) => {
                    if (err) {
                        console.error('Error reading email template:', err)
                        return res.status(500).json({ message: 'Error sending verification email' })
                    }

                    const emailHTML = data.replace('{{otp}}', otp)

                    const mailOptions = {
                        from: 'ukyp2014@gmail.com',
                        to: email,
                        subject: 'Email Verification',
                        html: emailHTML
                    }

                    transporter.sendMail(mailOptions, async (error) => {
                        if (error) {
                            console.error('Error sending email:', error)
                            return res.status(500).json({ message: 'Error sending verification email' })
                        }

                        return res.status(200).json({
                            message: 'OTP sent to your email. Please verify to complete login.',
                        })
                    })
                })
            } else {
                return res.status(401).json({ error: 'Password incorrect' })
            }
        } else {
            return res.status(401).json({ error: 'User not found' })
        }
    } catch (error) {
        console.error('Error logging in:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}


const VerifyOtp = async (req, res) => {
    const { email, otp } = req.body
    console.log("running")
    try {
        const userDocs = await UserSchema.findOne({ email })
        console.log(userDocs)
        if (userDocs) {
            
            if (userDocs.otp === otp && new Date() < userDocs.otpExpiration) {
                
                const token = jwt.sign(
                    { userId: userDocs._id },
                    JWT_SECRET,
                    { expiresIn: '1h' } 
                )
                userDocs.otp = null
                userDocs.otpExpiration = null
                await userDocs.save()
                return res.status(200).json({
                    user: userDocs,
                    token: token
                })
            } else {
                return res.status(401).json({ error: 'Invalid OTP or OTP expired' })
            }
        } else {
            return res.status(404).json({ error: 'User not found' })
        }
    } catch (error) {
        console.error('Error verifying OTP:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}



const SignUp=async(req,res)=>{
    const {username,email,image,password}=req.body
    try {
        const bcryptPassword=await bcrypt.hash(password, 10)
        const newUser=new UserSchema({email,password:bcryptPassword,username,image})
        const response=await newUser.save()
        jwt.sign({
            username:username,
            email:email,
            id:response
        },JWT_SECRET,{},(err,token)=>{
            if(err) throw err
            res.status(200).cookie('token',token,{httpOnly:true}).send('User Created')
        })
        res.status(200).send('User registered successfully')
    } catch (error) {
        console.error(error)
        res.status(500).send('Error registering user')
    }
}

module.exports={Login,SignUp,VerifyOtp}