const express = require("express");
const router = express.Router();
const passport = require("passport");

// ================= LOGIN PAGE =================
router.get("/login", (req, res) => {
  res.render("users/login");
});

// ================= LOGIN POST =================
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    const redirectUrl = req.session.redirectUrl || "/listings";
    delete req.session.redirectUrl;

    req.flash("success", "Logged in successfully");
    res.redirect(redirectUrl);
  }
);

// ================= SIGNUP PAGE =================
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// ================= GOOGLE LOGIN =================
router.get(
  "/auth/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ================= GOOGLE CALLBACK (FIXED) =================
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    const redirectUrl = req.session.redirectUrl || "/listings";
    delete req.session.redirectUrl;

    req.flash("success", "Logged in with Google");
    res.redirect(redirectUrl);
  }
);

// ================= LOGOUT =================
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash("success", "Logged out");
    res.redirect("/listings");
  });
});

// ================= HOME =================
router.get("/", (req, res) => {
  res.redirect("/listings");
});

module.exports = router;
