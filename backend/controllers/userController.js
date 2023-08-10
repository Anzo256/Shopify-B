const ErrorHandler = require("../utils/errorhandler");
const catchAysncErrors = require("../middleware/catchAysncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//Register a user
exports.registerUser = catchAysncErrors(async(req,res,next)=>{
    const {name, email,password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: "this is a sample id",
            url:"profilepicUrl",
        },
    });
   
    sendToken(user,201,res);
 
});


//login User
exports.loginUser = catchAysncErrors (async(req,res,next)=>{
    const {email,password} = req.body;

    //checking if the user has given password and email
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email and Password!",400));
    }
  
    const user = await User.findOne({email}).select("+password");
    if (!user) {
       return next(new ErrorHandler("Invalid email or password",401)); 
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
       return next(new ErrorHandler("Invalid email or password",401)); 
    }
   
    sendToken(user,200,res);
});


///Logout
exports.logout = catchAysncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success:true,
        message: "Logged Out!",
    });
});

//Forgot password
exports.forgotPassword = catchAysncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if (!user) {
       return next(new ErrorHandler("User not found!",404)); 
    }

    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false});

    const  resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
        )}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email
    then, please ignore it `;

    try {

        await sendEmail({
          email: user.email,
          subject: `Shopify-B Password Recovery`,
          message,
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        });
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message, 500));
    }
});

//Reset password
exports.resetPassword = catchAysncErrors(async(req,res,next)=>{

    //creating token hash
     const resetPasswordToken = crypto
     .createHash("sha256")
     .update(req.params.token)
     .digest("hex");

     const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt: Date.now() },
     });

     if (!user) {
        return next(new ErrorHandler("Reset Password Token is invalide or has  expired",400));
     }

     if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords dont match",400));
     }

     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordExpire = undefined;

      await user.save();

      sendToken(user, 200,res);
})