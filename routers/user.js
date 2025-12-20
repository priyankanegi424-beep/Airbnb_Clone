const express = require("express");
const router = express.Router();
const passport = require("passport");

console.log("✅ userRouter loaded");


// ================= LOGIN PAGE =================
router.get("/login", (req, res) => {
  res.render("users/login");
});

// ================= SIGNUP PAGE =================
router.get("/signup", (req, res) => {
  res.render("users/signup");
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




// ================= LOGOUT =================
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success", "Logged out");
    res.redirect("/listings");
  });
});

// ================= HOME REDIRECT =================
router.get("/", (req, res) => {
  res.redirect("/listings");
});

module.exports = router;
