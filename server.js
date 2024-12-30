import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import passport from 'passport'
import authRoutes from "./Routes/authRoutes.js"
import session from 'express-session'
import './Config/passportConfig.js'
import { isAuthenticated } from './Middlewares/authMiddleware.js'

dotenv.config()

const app = express()
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected")
    }).catch((err) => {
        console.log(err)
    });

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.get('/', (req, res) => {
    return res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get('/profile', isAuthenticated, (req, res) => {
    return res.send(`Welcome ${req.user.userName}`);
});

const PORT = process.env.PORT || 4321;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});