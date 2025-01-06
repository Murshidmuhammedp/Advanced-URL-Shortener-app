import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from "./Routes/authRoutes.js"
import session from 'express-session'
import passport from './Config/passportConfig.js'
import { isAuthenticated } from './Middlewares/authMiddleware.js'
import rateLimit from 'express-rate-limit'
import urlRoutes from './Routes/urlRoutes.js'
import MongoStore from 'connect-mongo'
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json' assert{type: 'json'};
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json());

// Cors
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rate Limiter
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: "Too many requests,please try again later."
});
app.use(limiter);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected")
    }).catch((err) => {
        console.log(err)
    });

// Session 
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            ttl: 24 * 60 * 60,
        }),
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api", urlRoutes);

app.get('/', (req, res) => {
    return res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get('/profile', isAuthenticated, (req, res) => {
    return res.send(`Welcome ${req.user.userName}`);
});

// Server Running
const PORT = process.env.PORT || 4321;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});