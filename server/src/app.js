import express from 'express';
import cors from 'cors' ;
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import adminRouter from './routes/admin.route.js';

const app = express()
app.use(cors())
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())


app.use('/ping',(req,res)=>{
    res.send('/pong')
})

//User routes
app.use('/api/v1/users', userRouter)

//Admin routes
app.use('/api/v1/admin', adminRouter)

//404 handling
app.use((req, res)=>{
    res.status(404).send('404 Not Found')
})


export  {app}