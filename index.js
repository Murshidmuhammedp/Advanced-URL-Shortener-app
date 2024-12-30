import dotenv from 'dotenv'
import express from "express";
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config()
const app = express()

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5645/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get('/', (req, res) => {
    return res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get(
    "/auth/google",
    passport.authenticate('google', { scope: ["profile", "email"] })
);

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: "/" }),
    (req, res) => {
        return res.redirect('/profile')
    }
);

app.get('/profile', (req, res) => {
    return res.send(`Welcome ${req.user.displayName}`);
});

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});

const PORT = process.env.PORT || 4321;


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});