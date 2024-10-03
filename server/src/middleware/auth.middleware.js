import { User } from '../model/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asynchandler.js';

const isLoggedin = asyncHandler(async (req, res, next) => {
    const token = req.cookies.accessToken;
    console.log("token here::" + token);
    if (!token) {
        return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }
    try {
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodeToken?._id);

        if (!user) {
            return res.status(401).json(new ApiError(401, "Invalid Access Token"));
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json(new ApiError(401, "Invalid Token"));
    }
});

export default isLoggedin;

// Middleware to check if user has an active subscription or not
export const authorizeSubscribers = asyncHandler(async (req, _res, next) => {
    if (req.user.role !== "ADMIN" && req.user.subscription.status !== "active") {
        throw new ApiError(400, "Please subscribe to access this route.");
    }
    next();
});

// Middleware to check if user is admin or not
export const authorizeRoles = (...roles) =>
    asyncHandler(async (req, _res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "You do not have permission to view this route");
        }
        next();
});