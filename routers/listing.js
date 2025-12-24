const express = require("express");
const router = express.Router();

const listingController = require("../controllers/listings");
const wrapAsync = require("../utils/wrapAsync");

// middleware
const { isLoggedIn, isOwner } = require("../middleware");

// multer + cloudinary
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

/* ===================== INDEX ===================== */
router.get("/", wrapAsync(listingController.index));

/* ===================== NEW LISTING ===================== */
/* 🔐 LOGIN REQUIRED */
router.get("/new", isLoggedIn, listingController.renderNewForm);

/* ===================== CREATE LISTING ===================== */
/* 🔐 LOGIN REQUIRED + MULTI IMAGE UPLOAD */
router.post(
  "/",
  isLoggedIn,
  upload.array("listing[images]", 20),
  wrapAsync(listingController.createListing)
);

/* ===================== FILTER ===================== */
router.get("/filterbtn", listingController.filterbtn);
router.get("/filter/:id", wrapAsync(listingController.filter));

/* ===================== SEARCH ===================== */
router.get("/search", wrapAsync(listingController.search));

/* ===================== SHOW LISTING ===================== */
router.get("/:id", wrapAsync(listingController.showListing));

/* ===================== EDIT LISTING ===================== */
/* 🔐 LOGIN + OWNER CHECK */
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

/* ===================== UPDATE LISTING ===================== */
/* 🔐 LOGIN + OWNER + MULTI IMAGE */
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.array("listing[images]", 20),
  wrapAsync(listingController.updateListing)
);

/* ===================== DELETE LISTING ===================== */
/* 🔐 LOGIN + OWNER */
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
