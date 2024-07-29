import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
    fullName: {
        required : [true , 'full name is required'],
        type: String ,
        minLength: [ 5 , 'full name must be 5 character'],
        maxLength: [ 50 , 'full name must be 50 character'],
        trim : true
    },
    email:{
        unique : [true , 'Email is required'] ,
        type : String ,
        unique : true ,
        match : [/.+\@.+\../, "Please enter a valid email"]
    },
    username : {
        required : true ,
        type : String ,
    },
    password : {
        required : true ,
        type : String ,
        minLength : [ 8 , 'password must be 8 character'],
        select : false ,
    },
    avatar : {
        public_id : {
            type : String
        } ,
        secure_url : {
            type : String
        }
    } ,
    role : {
        type : String ,
        enum : ["USER", "ADMIN"] ,
        default : "USER"
    },
    forgotPasswordToke : String ,
    forgotPasswordExpiry : Date
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.isAdmin = function(){
    return this.role === "ADMIN"
}

userSchema.methods.generateJwtToken = function(){
    return jwt.sign({
        _id : this._id ,
        email : this.email ,
        fullName : this.fullName
    }),
    process.env.JWT_SECRET ,
    {expiresIn : process.env.JWT_EXPIRY}
}


export  const User = mongoose.model("User", userSchema)