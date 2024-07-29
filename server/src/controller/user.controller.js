import {User} from '../model/User.model.js';
import asyncHandler from '../utils/asynchandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';


const Cookieoptions = {
    httpOnly : true,
    secure : true ,
    maxAge : 7 * 24 * 60 * 60 * 1000 
}

//Register a user
const register = asyncHandler(async (req,res)=>{
    const {fullName, email, password } = req.body
    
    if(!name || !email || !password){
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
            url : "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg"
        }
    })

    if(!user){
        throw new ApiError(500, "Something went wrong while registering the user , Please try again later")
    }

    //upload to cloudinary

    
    await user.save() ;

    const token = user.generateJwtToken()
   
    return res
    .status(201)
    .cookie("token", token, Cookieoptions)
    .json(
        new ApiResponse(201, {user}, "User registered successfully")
    )
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

    //Check if password is incorrect
    if(!user.isPasswordCorrect(password)){
        throw new ApiError(401, "Invalid password")
    }

    const token = user.generateJwtToken()
    user.password = undefined ;

    return res
    .status(200)
    .cookie("token", token, Cookieoptions)
    .json(
        new ApiResponse(200, user , "User logged in successfully")
    )
})

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

const resetPassword = asyncHandler(async (req, res)=>{
    const {email, newPassword} = req.body

    if(!email || !newPassword){
        throw new ApiError(400, "Please fill all the fields")
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        throw new ApiError(404, "User not found")
    }

    user.password = newPassword

    await user.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Password reset successfully")
    )
})

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


export {
    register,
    login ,
    logout ,
    resetPassword,
    profile
}