import express from 'express';
import cors from 'cors' ;
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import courseRouter from './routes/course.route.js';
import paymentRoutes from './routes/payment.route.js';
import miscRoutes from './routes/miscellaneous.route.js';

const app = express()
app.use(cors(
    {
        origin: [process.env.FRONTEND_URL],
        credentials: true
    }
))
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
app.use('/api/v1/courses',courseRouter )


app.use('/api/v1/payments', paymentRoutes);

app.use('/api/v1', miscRoutes);

//404 handling
app.use((req, res)=>{
    res.status(404).send('404 Not Found')
})


export  {app}