const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");
const ExpressError = require("../utils/ExpressError.js");

const redirectToLogin = (req, res) => {
   req.session.redirectUrl = req.originalUrl;
   req.flash("error", "Please log in to continue.");
   return res.redirect("/login");
};

module.exports.isLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated || !req.isAuthenticated()) {
      return redirectToLogin(req, res);
   }

   return next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
   if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
      delete req.session.redirectUrl;
   }

   next();
};

module.exports.authorizeRoles = (...roles) => {
   return (req, res, next) => {
      if (!req.user) {
         return redirectToLogin(req, res);
      }

      if (!roles.includes(req.user.role)) {
         return next(new ExpressError(403, "Access denied for this action."));
      }

      return next();
   };
};

module.exports.isListingManager = async (req, res, next) => {
   const { id } = req.params;
   const listing = await Listing.findById(id).select("owner");

   if (!listing) {
      return next(new ExpressError(404, "Listing not found."));
   }

   const isAdmin = req.user.role === "admin";
   const isOwner = listing.owner && listing.owner.equals(req.user._id);

   if (!isAdmin && !isOwner) {
      return next(new ExpressError(403, "You do not have permission to manage this listing."));
   }

   return next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
   const { reviewId } = req.params;
   const review = await Review.findById(reviewId).select("author");

   if (!review) {
      return next(new ExpressError(404, "Review not found."));
   }

   const isAdmin = req.user.role === "admin";
   const isAuthor = review.author && review.author.equals(req.user._id);

   if (!isAdmin && !isAuthor) {
      return next(new ExpressError(403, "You do not have permission to manage this review."));
   }

   return next();
};

module.exports.canManageBooking = async (req, res, next) => {
   const { bookingId } = req.params;
   const booking = await Booking.findById(bookingId).select("user");

   if (!booking) {
      return next(new ExpressError(404, "Booking not found."));
   }

   const isAdmin = req.user.role === "admin";
   const isOwner = booking.user && booking.user.equals(req.user._id);

   if (!isAdmin && !isOwner) {
      return next(new ExpressError(403, "You do not have permission to manage this booking."));
   }

   return next();
};
