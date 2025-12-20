const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
// const User = require("../models/user");
const Otp = require("../models/otp");
const admin = require("../firebaseAdmin");
// const User = require("../models/user");





const {
  saveRedirectUrl,
  isLoggedIn,
  isProfileOwner,
  validateUser,
  varifyEmail,
  varifyUserEmail,
} = require("../middleware");

const userController = require("../controllers/users");

const multer = require("multer"); //install multer package in npm || multipart/form-data type receive and paras
// const upload = multer({ dest: 'uploads/' })  //uploads folder me save karega
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



// LOGIN via Google
router.get(
  "/auth/google/login",
  (req, res, next) => {
    req.session.googleFlow = "login";
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// SIGNUP via Google
router.get(
  "/auth/google/signup",
  (req, res, next) => {
    req.session.googleFlow = "signup";
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// Google OAuth callback


// Router.route-----------------------
router
  .route("/signup")
  .get(userController.renderSignupForm) //signup-----------
  .post(varifyEmail, validateUser, wrapAsync(userController.signUser));

router
  .route("/login")
  .get(userController.renderLoginForm) //login----------
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.loginUser)
  );
//passpost.authenticate -> middleware h || local Strategy failureRedirect -> login hone me problem aati h to "/login" me redirect hoge || or flash ho jayega

router.get("/logout", userController.logoutUser); //logout----------

router.get("/", (req, res) => {
  //redirect home page---------
  res.redirect("/listings");
});
router.get(
  "/update-form/:id",
  isLoggedIn,
  isProfileOwner,
  wrapAsync(userController.updateFormRender)
); //update  form render------------

router.post(
  "/update-password/:id",
  isLoggedIn,
  isProfileOwner,
  wrapAsync(userController.updatePassword)
); //update password ------------

router.post(
  "/update-account/:id",
  isLoggedIn,
  isProfileOwner,
  varifyUserEmail,
  validateUser,
  wrapAsync(userController.updateAccount)
); //update account------------

router.post(
  "/update-image/:id",
  isLoggedIn,
  isProfileOwner,
  upload.single("image"),
  wrapAsync(userController.updateImage)
); //update image------------

router
  .route("/change-image/:id")
  .get(isLoggedIn, isProfileOwner, userController.renderImageChangeForm)
  .post(
    isLoggedIn,
    isProfileOwner,
    upload.single("image"),
    wrapAsync(userController.updateImage)
  ); //update image------------

router.delete(
  "/delete/:id",
  isLoggedIn,
  isProfileOwner,
  wrapAsync(userController.deleteAccount)
); //delete account------------




router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    if (err) return next(err);

    const flow = req.session.googleFlow;
    delete req.session.googleFlow;

    // 🔹 CASE 1: User already exists → LOGIN
    if (user) {
      return req.login(user, (err) => {
        if (err) return next(err);

        if (flow === "signup") {
          req.flash("success", "You already have an account. Logged in.");
        } else {
          req.flash("success", "Logged in successfully.");
        }

        return res.redirect("/listings");
      });
    }

    // 🔹 CASE 2: User NOT registered
    if (flow === "login") {
      req.flash(
        "error",
        "You are not registered. Redirecting to signup..."
      );
      return res.redirect("/signup");
    }

    // 🔹 CASE 3: Signup flow → AUTO REGISTER + LOGIN
    passport.authenticate("google", (err, user, profile) => {
    if (err) {
        console.error("Google Auth Error:", err);
        return res.redirect("/login");
    }

    if (!profile) {
        console.error("Google profile missing");
        return res.redirect("/login");
    }

    req.logIn(user, (err) => {
        if (err) {
            console.error("Login error:", err);
            return res.redirect("/login");
        }
        return res.redirect("/");
    });
});


    const newUser = new User({
      fName: profile.fName,
      lName: profile.lName,
      email: profile.email,
      username: profile.email,
      googleId: profile.googleId,
      profileImage: profile.profileImage,
    });


    const randomPassword = Math.random().toString(36).slice(-8);
    const registeredUser = await User.register(newUser, randomPassword);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Account created successfully.");
      return res.redirect("/listings");
    });
  })(req, res, next);
});

//otp mobile login/signup routes
router.post("/auth/mobile/send-otp", async (req, res) => {
  const { mobile } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.findOneAndDelete({ mobile });

  await Otp.create({
    mobile,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  console.log("OTP (DEV):", otp); // SMS API later

  res.json({ success: true, message: "OTP sent" });
});


//verify otp
const User = require("../models/user"); // make sure this exists

router.post("/auth/phone/verify", async (req, res, next) => {
  try {
    const { phone } = req.body;

    // 🔴 HARD GUARD (IMPORTANT)
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number missing"
      });
    }

    const cleanPhone = phone.replace(/\D/g, "");

    let user = await User.findOne({ phone: cleanPhone });

    if (!user) {
      const autoUsername = `user_${cleanPhone.slice(-6)}`;

      user = new User({
        phone: cleanPhone,
        username: autoUsername,
        authProvider: "phone"
      });

      await user.save();
    }

    req.login(user, (err) => {
      if (err) return next(err);

      req.flash("success", "Logged in successfully");
      return res.json({ success: true });
    });

  } catch (err) {
    console.error("OTP VERIFY ERROR:", err);
    res.status(500).json({ success: false });
  }
});





module.exports = router; //export---app.js---------------
