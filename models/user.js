const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const { allRoles } = require("../utils/listingOptions.js");

const userSchema = new Schema({
   fullName: {
      type: String,
      trim: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
   },
   role: {
      type: String,
      enum: allRoles,
      default: "user",
   },
}, {
   timestamps: true,
});

userSchema.plugin(passportLocalMongoose, {
   usernameLowerCase: true,
});

module.exports = mongoose.model("User",userSchema);
