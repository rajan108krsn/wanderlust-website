const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");

// Render Signup Page
router.get("/signup", (req, res) => {
    res.render("users/signup", { messages: req.flash() });
});

// Handle Signup Form Submission
router.post(
    "/signup",
    [
        body("email")
            .isEmail()
            .withMessage("Please provide a valid email")
            .normalizeEmail(),
        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
        body("fullname")
            .notEmpty()
            .withMessage("Full name is required")
            .trim()
            .escape(),
    ],
    async (req, res, next) => {
        // console.log(req.body);
        const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     req.flash("error", errors.array().map(err => err.msg));
        //     return res.redirect("/signup");
        // }

        try {
        // console.log("hi i am try block");
            const { email, password, fullname } = req.body;
            const user = new User({ email, fullname });

            // Register user
            const registeredUser = await User.register(user, password);
            console.log(registeredUser);
            // Auto-login after registration
            req.login(registeredUser, (err) => {
                if (err) {
                    req.flash("error", "Auto-login failed. Please log in manually.");
                    return res.redirect("/login");
                }
                req.flash("success", "Welcome to Wanderlust Airbnb!");
                return res.redirect("/listings");
            });

        } catch (error) {
        // console.log("hi i am catch block");
            console.error("Registration Error:", error);
            req.flash("error", error.message);
            return res.redirect("/signup");
        }
    }
);

// Render Login Page
router.get("/login", (req, res) => {
    res.render("users/login");
});

// // Handle Login Authentication
// router.post(
//     "/login",
//     passport.authenticate("local", {
//         failureFlash: true,
//         failureRedirect: "/login",
//         keepSessionInfo: true, // Keep session info intact
//     }),
//     (req, res) => {
//         const redirectUrl = req.session.returnTo || "/listings"; // Redirect to saved URL or default to /listings
//         delete req.session.returnTo; // Clean up session
//         req.flash("success", "Welcome back!");
//         res.redirect(redirectUrl);
//     }
// );

router.post(
    "/login", saveRedirectUrl, 
    (req, res, next) => {
        // Map email to username for passport-local
        req.body.username = req.body.email;
        console.log("Login Request Body:", req.body); // Log the request body
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                console.error("Authentication Error:", err);
                return next(err);
            }
            if (!user) {
                console.log("Authentication Failed:", info);
                req.flash("error", info.message || "Invalid email or password");
                return res.redirect("/login");
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.error("Login Error:", err);
                    req.flash("error", "Login failed. Please try again.");
                    return res.redirect("/login");
                }
                req.flash("success", "Welcome back!");
                const redirectUrl = res.locals.redirectUrl || "/listings"; // Fallback to default
                res.redirect(redirectUrl);
            });
        })(req, res, next);
    }
);

// Handle Logout
router.get("/logout", async (req, res, next) => {
    try {
        console.log("Logout route triggered"); // Debugging log
        await req.logout((err) => {
            if (err) {
                console.error("Logout Error:", err);
                return next(err);
            }
            console.log("User logged out successfully"); // Debugging log
        });
        req.flash("success", "You have been logged out.");
        res.redirect("/listings");
    } catch (err) {
        console.error("Logout Error:", err);
        next(err);
    }
});

module.exports = router;

