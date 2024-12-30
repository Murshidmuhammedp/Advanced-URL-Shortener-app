import express from 'express'
import passport from 'passport';
import { loginSuccess, logout } from '../Controllers/authController.js';

const router = express.Router();

router.get(
    "/google",
    passport.authenticate('google', { scope: ["profile", "email"] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: "/" }),
    (req, res) => {
        return res.redirect('/profile')
    }
);

router.get('/success', loginSuccess);

router.get('/logout', logout);

export default router;