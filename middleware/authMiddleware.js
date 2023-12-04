const ensureAuthenticated = (req, res, next) => {
    console.log(req.isAuthenticated(), "IS AUTHED?");
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/");
};

const ensureGuest = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/dashboard");
};

module.exports = { ensureAuthenticated, ensureGuest };
