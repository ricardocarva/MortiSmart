const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
    ensureAuthenticated,
    ensureGuest,
} = require("../middleware/authMiddleware");

// Registration route
router.post(
    "/register",
    passport.authenticate("local-signup", {
        successRedirect: "/dashboard",
        failureRedirect: "/",
        failureFlash: true, // Enable flash messages for error handling
    })
);

// Google OAuth route
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/dashboard",
        failureRedirect: "/",
    })
);
// this needs to be the last route defined
// redirect all routes to home, anything that would 404 just goes back to home
/* router.all("*", (req, res) => {
    res.redirect("/");
}); */

module.exports = router;
