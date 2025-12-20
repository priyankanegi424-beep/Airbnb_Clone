const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

/* ===================== INDEX ===================== */
module.exports.index = async (req, res) => {
  const allListing = await Listing.find().sort({ _id: -1 });
  res.render("listings/index.ejs", { allListing });
};

/* ===================== NEW FORM ===================== */
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

/* ===================== CREATE LISTING ===================== */
module.exports.createListing = async (req, res, next) => {
  const response = await geocodingClient
    .forwardGeocode({
      query: `${req.body.listing.location}, ${req.body.listing.country}`,
      limit: 1,
    })
    .send();

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // ✅ MULTIPLE IMAGES
  if (req.files && req.files.length > 0) {
    newListing.images = req.files.map(file => ({
      url: file.path,
      filename: file.filename,
    }));
  } else {
    newListing.images = [];
  }

  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

/* ===================== SHOW LISTING ===================== */
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

/* ===================== EDIT FORM ===================== */
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  // thumbnail (first image only)
  let originalImage = null;
  if (listing.images && listing.images.length > 0) {
    originalImage = listing.images[0].url.replace(
      "/upload",
      "/upload/w_200,h_150"
    );
  }

  res.render("listings/edit.ejs", { listing, originalImage });
};

/* ===================== UPDATE LISTING ===================== */
module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await geocodingClient
      .forwardGeocode({
        query: `${req.body.listing.location}, ${req.body.listing.country}`,
        limit: 1,
      })
      .send();

    if (!response.body.features.length) {
      req.flash("error", "Invalid location or country");
      return res.redirect(`/listings/${id}/edit`);
    }

    const listing = await Listing.findByIdAndUpdate(
      id,
      req.body.listing,
      { new: true }
    );

    listing.geometry = response.body.features[0].geometry;

    // ✅ ADD NEW IMAGES (OLD STAY)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        filename: file.filename,
      }));
      listing.images.push(...newImages);
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

/* ===================== DELETE LISTING ===================== */
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

/* ===================== FILTER ===================== */
module.exports.filter = async (req, res) => {
  const { id } = req.params;
  const allListing = await Listing.find({ category: { $all: [id] } });

  if (allListing.length) {
    res.locals.success = `Listings found by ${id}`;
    return res.render("listings/index.ejs", { allListing });
  }

  req.flash("error", "Listings not found!");
  res.redirect("/listings");
};

module.exports.filterbtn = (req, res) => {
  res.render("listings/filterbtn.ejs");
};

/* ===================== SEARCH ===================== */
module.exports.search = async (req, res) => {
  let input = req.query.q.trim().replace(/\s+/g, " ");

  if (!input) {
    req.flash("error", "Search value empty!");
    return res.redirect("/listings");
  }

  const keyword = input.toLowerCase();

  let allListing = await Listing.find({
    title: { $regex: keyword, $options: "i" },
  });

  if (allListing.length) {
    res.locals.success = "Listings searched by Title";
    return res.render("listings/index.ejs", { allListing });
  }

  allListing = await Listing.find({
    category: { $regex: keyword, $options: "i" },
  });

  if (allListing.length) {
    res.locals.success = "Listings searched by Category";
    return res.render("listings/index.ejs", { allListing });
  }

  allListing = await Listing.find({
    country: { $regex: keyword, $options: "i" },
  });

  if (allListing.length) {
    res.locals.success = "Listings searched by Country";
    return res.render("listings/index.ejs", { allListing });
  }

  allListing = await Listing.find({
    location: { $regex: keyword, $options: "i" },
  });

  if (allListing.length) {
    res.locals.success = "Listings searched by Location";
    return res.render("listings/index.ejs", { allListing });
  }

  const price = parseInt(keyword, 10);
  if (!isNaN(price)) {
    allListing = await Listing.find({ price: { $lte: price } }).sort({ price: 1 });
    if (allListing.length) {
      res.locals.success = `Listings under ₹${price}`;
      return res.render("listings/index.ejs", { allListing });
    }
  }

  req.flash("error", "Listings not found!");
  res.redirect("/listings");
};
