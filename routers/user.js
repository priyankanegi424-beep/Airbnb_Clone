const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");

// ================= GOOGLE LOGIN =================
router.get(
  "/auth/google/login",
  (req, res, next) => {
    req.session.googleFlow = "login";
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ================= GOOGLE SIGNUP =================
router.get(
  "/auth/google/signup",
  (req, res, next) => {
    req.session.googleFlow = "signup";
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ================= GOOGLE CALLBACK =================
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    const flow = req.session.googleFlow;
    delete req.session.googleFlow;

    if (flow === "signup") {
      req.flash("success", "Account created & logged in");
    } else {
      req.flash("success", "Logged in successfully");
    }

    res.redirect("/listings");
  }
);

// ================= NORMAL ROUTES =================
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success", "Logged out");
    res.redirect("/listings");
  });
});

router.get("/", (req, res) => {
  res.redirect("/listings");
});

module.exports = router;
