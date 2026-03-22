const mongoose =  require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { listingCategories } = require("../utils/listingOptions.js");
const slugify = require("../utils/slugify.js");

const defaultImage = {
   url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
   filename: "wanderlust/default-cover",
};

const listingSchema = new Schema({
   title: {
      type: String,
      required: true,
      trim: true,
   } ,
   slug: {
      type: String,
      trim: true,
   },
   description:{
      type: String,
      required: true,
      trim: true,
   },
   image:{
      url: {
         type: String,
         default: defaultImage.url,
      },
      filename: {
         type: String,
         default: defaultImage.filename,
      },
   },
   price:{
      type: Number,
      required: true,
      min: 0,
   },
   location:{
      type: String,
      required: true,
      trim: true,
   },
   country:{
      type: String,
      required: true,
      trim: true,
   },
   category: {
      type: String,
      enum: listingCategories,
      required: true,
      default: "City",
   },
   maxGuests: {
      type: Number,
      min: 1,
      max: 12,
      default: 2,
   },
   ratingAverage: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
   },
   reviewCount: {
      type: Number,
      min: 0,
      default: 0,
   },
   reviews:[
      {
         type:Schema.Types.ObjectId,
         ref:"Review",
      },
   ],
   owner:{
      type: Schema.Types.ObjectId,
      ref:"User",
      required: true,
   },
}, {
   timestamps: true,
});

listingSchema.index({ title: "text", location: "text", country: "text" });
listingSchema.index({ category: 1, price: 1, ratingAverage: -1 });
listingSchema.index({ owner: 1, createdAt: -1 });

listingSchema.pre("validate", function(next) {
   if (this.title || this.location) {
      this.slug = slugify(`${this.title} ${this.location}`);
   }

   next();
});

listingSchema.virtual("seoPath").get(function() {
   return `/listings/${this._id}/${this.slug}`;
});

listingSchema.post("findOneAndDelete", async (listing) => {
   if (listing) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
      const Booking = mongoose.models.Booking;

      if (Booking) {
         await Booking.deleteMany({ listing: listing._id });
      }
   }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
