const Listing = require("../models/listing");
const Review = require("../models/review");

const syncListingRatings = async (listingId) => {
   const listing = await Listing.findById(listingId).populate("reviews");

   if (!listing) {
      return;
   }

   const reviewCount = listing.reviews.length;
   const totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
   listing.reviewCount = reviewCount;
   listing.ratingAverage = reviewCount ? Number((totalRating / reviewCount).toFixed(1)) : 0;
   await listing.save();
};

module.exports.createReview = async (req, res) => {
   const listing = await Listing.findById(req.params.id);
   if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
   }
   const newReview = new Review(req.body.review);
   newReview.author = req.user._id;
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   await syncListingRatings(req.params.id);
   req.flash("success", "New review added successfully.");
   res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
   const { id, reviewId } = req.params;
   await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   await Review.findByIdAndDelete(reviewId);
   await syncListingRatings(id);
   req.flash("success", "Review deleted successfully.");

   res.redirect(`/listings/${id}`);
};
