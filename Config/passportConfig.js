import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Models/UserModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user)
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5645/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('Profile:', profile);
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        userName: profile.displayName,
                        email: profile.emails[0].value,
                    });
                }
                // JWT Token 
                const token = jwt.sign({ id: user._id, email: user.email },
                    process.env.JWT_SECRET, { expiresIn: "1h" }
                );

                user.token = token;
                await user.save();
                console.log("Access Token:", token);

                return done(null, user);
            } catch (error) {
                console.error(error);
                return done(error, null);
            }
        }
    )
);

export default passport;