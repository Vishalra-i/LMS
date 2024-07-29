export default function asyncHandler(requestHandle){
    return async(req,res,next)=>{
        Promise.resolve(requestHandle(req, res, next))
        .catch(err=>next(err))
    }
}

export {asyncHandler}