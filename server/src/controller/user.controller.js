import {User} from '../model/User.model.js';
import asyncHandler from '../utils/asynchandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import { deleteOnCloudnary, uploadOnCloudinary } from '../utils/cloudinary.js';
import sendEmail from '../utils/sendEmail.js';


const Cookieoptions = {
    httpOnly : true,
    secure : true ,
    maxAge : 7 * 24 * 60 * 60 * 1000 ,
}

//Register a user
const register = asyncHandler(async (req,res)=>{
    const {fullName, email, password } = req.body
    
    if(!fullName || !email || !password){
        throw new ApiError(400, "Please fill all the fields")
    }

    //Check if user exists
    const userExists = await User.findOne({email})

    if(userExists){
        throw new ApiError(409, `User already exists :: ${userExists?.fullName}`)
    }

    const user = await User.create({
        fullName,
        email,
        password ,
        avatar : {
            public_id : email ,
            secure_url : "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg"
        }
    })

    if(!user){
        throw new ApiError(500, "Something went wrong while registering the user , Please try again later")
    }

    //upload to cloudinary
    const avatar = req.file?.path

    if(!avatar){
        console.log(`Profile photo is missing`)
    }


    const result = await uploadOnCloudinary(avatar)

    if(result){
        user.avatar.public_id = result.public_id
        user.avatar.secure_url = result.url
    }

    await user.save() ;

    const token = user.generateJwtToken()
   
    return res
    .status(200)
    .cookie("token", token, Cookieoptions)
    .setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Max-Age=604800`)
    .json(new ApiResponse(200, user, "User regisered  successfully"));

})

//Login a user
const login = asyncHandler(async (req, res)=>{
    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError(400, "Please fill all the fields")
    }

    const user = await User.findOne({email}).select("+password")

    //If user not found
    if(!user){
        throw new ApiError(404, "User not found")
    }


    const isPasswordValid = await user.isPasswordCorrect(password)

    //Check if password is incorrect
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password")
    }


    const token = user.generateJwtToken()

    user.password = undefined ;
    

    return res
    .status(200)
    .cookie("token", token, Cookieoptions)
    .json(new ApiResponse(200, user, "User logged in successfully"));

})

//Logout user by clearing cookie
const logout = asyncHandler(async (req, res)=>{
    
    const option = {
        httpOnly : true,
        secure : true ,
        maxAge : 0 ,
    }
    
    return res
    .status(200)
    .cookie("token",null, option)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )
})

//Get user details
const profile = asyncHandler(async (req, res)=>{
    const user = req.user._id ;
    
    const profile = await User.findById(user)
    if(!profile){
        throw new ApiError(404, "User not found")
    }
    profile.password = undefined ;
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, profile, "User profile fetched successfully")
    )
})

//Forgot password change by email thorough nodemailer
const forgotpassword = asyncHandler(async (req, res)=>{
     let {email} = req.body 
     email = email?.toLowerCase()

     if(!email){
        throw new ApiError(404 , 'Please enter a email') ;
     }

     const user = await User.findOne({email}) ;
     
     if(!user){
         throw new ApiError(404, 'User not found') ;
      }
        
        const resetToken = await user?.generateResetToken()
        
        
        await user.save() ;
        
        const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/?resetToken=${resetToken}`;
        
        // We here need to send an email to the user with the token
        const subject = 'Reset Password';
        const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;
        
        try {
            await sendEmail(
                email ,
                subject ,
                message 
            )
            
         return res
                .status(200)
                .json(new ApiResponse(200 , 'Email sent successfully'))
                
    } catch (error) {
        user.forgotPasswordToken = undefined ;
        user.forgotPasswordExpiry = undefined ;
        await user.save({validateBeforeSave : false}) ;
        return new ApiError(500,   error?.message )
    }
})

//Reset password 
const resetPassword = asyncHandler(async (req, res)=>{
   // Extracting resetToken from req.params object
  const { resetToken } = req.params;

  // Extracting password from req.body object
  const { password } = req.body;



  // Check if password is not there then send response saying password is required
  if (!password) {
    throw new ApiError(400,'Password is required');
  }


  // Checking if token matches in DB and if it is still valid(Not expired)
  const user = await User.findOne({
    forgotPasswordToken : resetToken ,
    forgotPasswordExpiry: { $gt: Date.now() }, // $gt will help us check for greater than value, with this we can check if token is valid or expired
  });

  // If not found or expired send the response
  if (!user) {
     throw new ApiError(400 , 'Token is invalid or expired, please try again')
  }

  // Update the password if token is valid and not expired
  user.password = password;

  // making forgotPassword* valus undefined in the DB
  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  // Saving the updated user values
  await user.save();

  // Sending the response when everything goes good
  res.status(200)
  .json(new ApiResponse(200 , 'Password change successfully'));
})

//Update details 
const updateUser = asyncHandler(async (req, res)=>{
    const { fullName } = req.body;
    const { id } = req.params;
  
    const user = await User.findById(id);
  
    if (!user) {
       throw new ApiError(404 , 'user not found')
    }
  
    if (fullName) {
      user.fullName = fullName;
    }
  
    // Run only if user sends a file
    if (req.file) {
      // Deletes the old image uploaded by the user
      await deleteOnCloudnary(user.avatar.public_id);
      const result = await uploadOnCloudinary(req.file.path ,{
        folder: "lms" ,
        width : 250 ,
        height : 250 ,
        crop : "fill",
        gravity : "faces"
     })
      user.avatar.public_id = result.public_id;
      user.avatar.secure_url = result.url;
    }
  
    // Save the user object
    await user.save();
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "User updated successfully")
    )
})


export {
    register,
    login ,
    logout ,
    profile,
    resetPassword,
    forgotpassword,
    updateUser
}