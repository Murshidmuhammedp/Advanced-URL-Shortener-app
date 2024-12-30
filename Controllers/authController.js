export const loginSuccess = (req, res) => {
    if (req.user) {
        return res.status(200).json({
            message: "User authenticated successfully",
            user: req.user,
        });
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export const logout = (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.redirect("/");
        return res.status(200).json({ message: "Logged out successfully" });
    });
};

