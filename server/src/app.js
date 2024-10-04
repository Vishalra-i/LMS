import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import courseRouter from './routes/course.route.js';
import paymentRoutes from './routes/payment.route.js';
import miscRoutes from './routes/miscellaneous.route.js';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL2],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(morgan('dev'));

// Equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
app.use('/ping', (req, res) => {
    res.send('/pong1');
});

// User routes
app.use('/api/v1/users', userRouter);

// Admin routes
app.use('/api/v1/courses', courseRouter);

// Payment routes
app.use('/api/v1/payments', paymentRoutes);

// Miscellaneous routes
app.use('/api/v1', miscRoutes);

// Serve HTML documentation
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

// 404 handling
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

export { app };
