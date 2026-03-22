const { bookingSchema, listingSchema, reviewSchema, signupSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

const validate = (schema, key) => (req, res, next) => {
   const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
   });

   if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return next(new ExpressError(400, message));
   }

   req.body = value;

   if (key && !req.body[key]) {
      return next(new ExpressError(400, "Invalid request payload."));
   }

   return next();
};

module.exports.validateListing = validate(listingSchema, "listing");
module.exports.validateReview = validate(reviewSchema, "review");
module.exports.validateBooking = validate(bookingSchema, "booking");
module.exports.validateSignup = validate(signupSchema);
