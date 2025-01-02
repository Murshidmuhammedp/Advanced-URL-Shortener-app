export const isAuthenticated = (req, res, next) => {
    console.log('User Authenticated:', req.isAuthenticated()); // Debug Log
    console.log('Session:', req.session); // Debug Log
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/');
};
