import { User } from '../model/User.model.js';
import {ApiError} from '../utils/ApiError.js'
import jwt from 'jsonwebtoken';
import asynchandler  from '../utils/asynchandler.js';

const isLoggedin = asynchandler(async (req,res,next)=>{
       const token = req.cookies?.token || req.headers['Authorization']?.replace('Bearer ', '');
      
       if(!token){
           return res.status(401).json(new ApiError(401, "Unauthorized request"))
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




// Middleware to check if user has an active subscription or not
export const authorizeSubscribers = asynchandler(async (req, _res, next) => {
    // If user is not admin or does not have an active subscription then error else pass
    if (req.user.role !== "ADMIN" && req.user.subscription.status !== "active") {
     throw ApiError( 400 ,"Please subscribe to access this route.")
    }
  
    next();
  });

  // Middleware to check if user is admin or not
export const authorizeRoles = (...roles) =>
    asynchandler(async (req, _res, next) => {
      if (!roles.includes(req.user.role)) {
        throw new ApiError(403 ,"You do not have permission to view this route")
      }
  
      next();
});