const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {
   authorizeRoles,
   isListingManager,
   isLoggedIn,
   validateBooking,
   validateListing,
} = require("../middlewares");
const listingController = require("../controllers/listings.js");
const bookingController = require("../controllers/bookings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/new", isLoggedIn, authorizeRoles("admin", "host"), listingController.renderNewForm);

router
   .route("/")
   .get(wrapAsync(listingController.index))
   .post(
      isLoggedIn,
      authorizeRoles("admin", "host"),
      upload.single("listing[image]"),
      validateListing,
      wrapAsync(listingController.createListing)
   );

router.get(
   "/:id/edit",
   isLoggedIn,
   authorizeRoles("admin", "host"),
   wrapAsync(isListingManager),
   wrapAsync(listingController.renderEditForm)
);

router.get("/:id/bookings/new", isLoggedIn, authorizeRoles("user"), wrapAsync(bookingController.renderNewBookingForm));
router.post("/:id/bookings", isLoggedIn, authorizeRoles("user"), validateBooking, wrapAsync(bookingController.createBooking));

router
   .route("/:id/:slug?")
   .get(wrapAsync(listingController.showListing))
   .put(
      isLoggedIn,
      authorizeRoles("admin", "host"),
      wrapAsync(isListingManager),
      upload.single("listing[image]"),
      validateListing,
      wrapAsync(listingController.updateListing)
   )
   .delete(isLoggedIn, authorizeRoles("admin"), wrapAsync(listingController.destroyListing));

module.exports = router;
