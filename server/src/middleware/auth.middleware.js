import { User } from '../model/User.model';
import {ApiError} from '../utils/ApiError'
import * as jwt from 'jsonwebtoken';
import * as next from 'next';
import asynchandler  from '../utils/asynchandler';

const isLoggedin = asynchandler(async (req,res,next)=>{
       const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "") ;
      
       if(!token){
           return res.status(401).json({message: "Unauthorized request"})
       }
     
       const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
       
       const user = await User.findById(decodeToken?._id)
     
       if(!user){
          return new ApiError(401, "Invalid Access Token")
       }
     
       req.user = user;
       next();
})


export default isLoggedin;