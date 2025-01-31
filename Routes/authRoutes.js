import express from 'express'
import passport from 'passport';
import { loginSuccess, logout } from '../Controllers/authController.js';
import { isAuthenticated } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Google Authentication
router.get(
    "/google",
    passport.authenticate('google', { scope: ["profile", "email"] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: "/" }),
    (req, res) => {
        return res.redirect(`/auth/success?token=${req.user.token}`)
        // return res.redirect('/profile')
    }
);

router.get('/success', isAuthenticated, loginSuccess);

router.get('/logout', logout);

export default router;