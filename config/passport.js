const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = (passport) => {
    // Local strategy configuration
    //passport.use(new LocalStrategy(User.authenticate()));
    //passport.serializeUser(User.serializeUser());
    //passport.deserializeUser(User.deserializeUser());

    passport.use(
        "local-signup",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                    // Check if the email is already registered
                    const existingUser = await User.findOne({ email: email });

                    if (existingUser) {
                        return done(
                            null,
                            false,
                            req.flash(
                                "signupMessage",
                                "That email is already taken."
                            )
                        );
                    } else {
                        // If the email is not registered, create a new user
                        const newUser = new User();
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);

                        await newUser.save();
                        return done(null, newUser);
                    }
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.use(
        "local-login",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                    console.log("Looking for user", email);

                    const user = await User.findOne({ email: email });

                    if (!user) {
                        return done(
                            null,
                            false,
                            req.flash("loginMessage", "No user found.")
                        );
                    }

                    if (!user.validPassword(password)) {
                        return done(
                            null,
                            false,
                            req.flash("loginMessage", "Oops! Wrong password.")
                        );
                    }

                    console.log("USER FOUND!", user);
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    // Google strategy configuration
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/auth/google/callback",
                scope: ["profile", "email"],
            },
            async (req, accessToken, refreshToken, profile, done) => {
                console.log("accessToken: ", refreshToken.access_token);
                console.log("refreshToken: ", refreshToken);
                console.log(refreshToken.expires_in);
                console.log("-----");
                try {
                    let user = await User.findOne({ googleId: profile.id });
                    const email = profile._json.email;

                    if (!user) {
                        user = await User.findOne({ email: email });
                    }

                    if (user) {
                        return done(null, user);
                    } else {
                        const newUser = new User();
                        newUser.googleId = profile.id;
                        newUser.email = email;
                        await newUser.save();
                        return done(null, newUser);
                    }
                } catch (err) {
                    return done(err);
                }
            }
        )
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).lean();
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
