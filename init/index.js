if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");
const User = require("../models/user.js");

const dbUrl = process.env.ATLASDB_URL || process.env.MONGO_URL;
const seedUsername = process.env.SEED_HOST_USERNAME || "wanderlustindiahost";
const seedPassword = process.env.SEED_HOST_PASSWORD || "wanderlust123";
const seedEmail = process.env.SEED_HOST_EMAIL || "host@wanderlustindia.com";

if (!dbUrl) {
   throw new Error("ATLASDB_URL or MONGO_URL must be defined in the environment.");
}

async function main() {
   await mongoose.connect(dbUrl);
   console.log("connected to DB");
}

async function findOrCreateSeedOwner() {
   let owner = await User.findOne({ role: { $in: ["host", "admin"] } });

   if (owner) {
      return owner;
   }

   owner = await User.findOne({ username: seedUsername });
   if (owner) {
      if (owner.role !== "host") {
         owner.role = "host";
         await owner.save();
      }
      return owner;
   }

   const seedUser = new User({
      username: seedUsername,
      fullName: "WanderLust India Host",
      email: seedEmail,
      role: "host",
   });

   return User.register(seedUser, seedPassword);
}

async function initDB() {
   const owner = await findOrCreateSeedOwner();

   await Promise.all([
      Booking.deleteMany({}),
      Review.deleteMany({}),
      Listing.deleteMany({}),
   ]);

   const seededListings = initData.data.map((listing) => ({
      ...listing,
      owner: owner._id,
      ratingAverage: 0,
      reviewCount: 0,
      reviews: [],
   }));

   await Listing.insertMany(seededListings);

   const categoryBreakdown = seededListings.reduce((accumulator, listing) => {
      accumulator[listing.category] = (accumulator[listing.category] || 0) + 1;
      return accumulator;
   }, {});

   console.log(`reset complete: ${seededListings.length} India listings inserted`);
   console.log(`seed owner: ${owner.username} (${owner.role})`);
   console.log("category breakdown:", categoryBreakdown);
}

main()
   .then(initDB)
   .catch((err) => {
      console.error(err);
      process.exitCode = 1;
   })
   .finally(async () => {
      await mongoose.connection.close();
   });
