export const isAuthenticated = (req, res, next) => {
    console.log('User Authenticated:', req.isAuthenticated());
    console.log('Session:', req.session);
    console.log('Session ID:', req.sessionID);
    
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/');
};
