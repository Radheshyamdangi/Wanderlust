const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
   comment: {
      type: String,
      trim: true,
   },
   rating: {
      type: Number,
      min:1,
      max:5
   },
   author:{
      type: Schema.Types.ObjectId,
      ref:"User",
   },
}, {
   timestamps: true,
});

module.exports = mongoose.model("Review" , reviewsSchema);
