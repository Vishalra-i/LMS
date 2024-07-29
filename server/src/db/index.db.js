import mongoose from "mongoose";
import {DB_NAME} from "../constant.js"

mongoose.set('strictQuery', false);

async function connectDb(){
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log('MongoDB Connected ' + connectionInstance.connection.host)
    } catch (error) {
        console.log('Mngodb connecttion failed ::' + error)
        process.exit(1)
    }
}


export default connectDb
