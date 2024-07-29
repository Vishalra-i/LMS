import {app} from './app.js'
import connectDb from './db/index.db.js'


connectDb().then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log(`MongoDB connection error ${err}`)
})
