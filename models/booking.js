const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookingSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
   },
   listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
   },
   checkIn: {
      type: Date,
      required: true,
   },
   checkOut: {
      type: Date,
      required: true,
   },
   guests: {
      type: Number,
      min: 1,
      max: 12,
      default: 1,
   },
   totalPrice: {
      type: Number,
      min: 0,
      required: true,
   },
   status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
   },
}, {
   timestamps: true,
});

bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
