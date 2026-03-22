const Joi = require("joi");
const { listingCategories, selfServeRoles } = require("./utils/listingOptions.js");

module.exports.listingSchema = Joi.object({
   listing: Joi.object({
      title: Joi.string().trim().min(4).max(80).required(),
      description: Joi.string().trim().min(20).max(1200).required(),
      location: Joi.string().trim().min(2).max(60).required(),
      country: Joi.string().trim().min(2).max(60).required(),
      category: Joi.string().valid(...listingCategories).required(),
      price: Joi.number().required().min(0),
      maxGuests: Joi.number().integer().min(1).max(12).default(2),
   }).required()
});

module.exports.reviewSchema = Joi.object({
   review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      comment: Joi.string().trim().min(8).max(500).required(),
   }).required(),
});

module.exports.bookingSchema = Joi.object({
   booking: Joi.object({
      checkIn: Joi.date().required(),
      checkOut: Joi.date().greater(Joi.ref("checkIn")).required(),
      guests: Joi.number().integer().min(1).max(12).required(),
   }).required(),
});

module.exports.signupSchema = Joi.object({
   fullName: Joi.string().trim().min(2).max(80).allow(""),
   username: Joi.string().trim().min(3).max(30).required(),
   email: Joi.string().trim().email().required(),
   password: Joi.string().min(6).max(64).required(),
   role: Joi.string().valid(...selfServeRoles).default("user"),
});
