const express = require("express");
const router = express.Router();
const passport = require("passport");

console.log("✅ userRouter loaded");

// ================= LOGIN PAGE =================
router.get("/login", (req, res) => {
  res.render("users/login");
});

// ================= LOGIN POST (🔥 MISSING FIX) =================
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Logged in successfully");
    res.redirect("/listings"); // ✅ existing route
  }
);

// ================= SIGNUP PAGE =================
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// ================= SIGNUP POST =================
router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new (require("../models/user"))({ username, email });
    const registeredUser = await require("../models/user").register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Account created successfully");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

// ================= GOOGLE LOGIN =================
router.get(
  "/auth/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ================= GOOGLE SIGNUP =================
router.get(
  "/auth/google/signup",
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
    req.flash("success", "Logged in with Google");
    res.redirect("/listings");
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

// ================= HOME REDIRECT =================
router.get("/", (req, res) => {
  res.redirect("/listings");
});

module.exports = router;
