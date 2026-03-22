const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const slugify = require("../utils/slugify.js");

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const createSeoPath = (listing) => {
   const slug = listing.slug || slugify(`${listing.title} ${listing.location}`);
   return `/listings/${listing._id}/${slug}`;
};

const getNights = (checkIn, checkOut) => Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / DAY_IN_MS));

module.exports.renderNewBookingForm = async (req, res) => {
   const listing = await Listing.findById(req.params.id)
      .select("title slug price location country image maxGuests owner")
      .populate("owner", "username fullName")
      .lean();

   if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
   }

   res.render("bookings/new.ejs", {
      listing: {
         ...listing,
         seoPath: createSeoPath(listing),
      },
      meta: {
         title: `Book ${listing.title} | WanderLust`,
         description: "Choose your travel dates and confirm a cleaner, faster booking flow on WanderLust.",
      },
   });
};

module.exports.createBooking = async (req, res) => {
   const listing = await Listing.findById(req.params.id).select("title slug price location country owner");

   if (!listing) {
      throw new ExpressError(404, "Listing not found.");
   }

   if (listing.owner && listing.owner.equals(req.user._id)) {
      throw new ExpressError(400, "You cannot book your own listing.");
   }

   const checkIn = new Date(req.body.booking.checkIn);
   const checkOut = new Date(req.body.booking.checkOut);

   const overlappingBooking = await Booking.exists({
      listing: listing._id,
      status: "confirmed",
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
   });

   if (overlappingBooking) {
      throw new ExpressError(409, "Those dates are already booked. Please choose a different stay window.");
   }

   const nights = getNights(checkIn, checkOut);
   const booking = new Booking({
      ...req.body.booking,
      checkIn,
      checkOut,
      listing: listing._id,
      user: req.user._id,
      totalPrice: nights * listing.price,
   });

   await booking.save();

   req.flash("success", "Booking confirmed successfully.");
   res.redirect("/bookings");
};

module.exports.index = async (req, res) => {
   let bookingScope = "your";
   let bookings = [];

   if (req.user.role === "admin") {
      bookingScope = "platform";
      bookings = await Booking.find({})
         .sort({ createdAt: -1 })
         .populate("listing", "title slug location country")
         .populate("user", "username fullName")
         .lean();
   } else if (req.user.role === "host") {
      bookingScope = "host";
      const hostListings = await Listing.find({ owner: req.user._id }).select("_id").lean();
      const hostListingIds = hostListings.map((listing) => listing._id);

      bookings = hostListingIds.length
         ? await Booking.find({ listing: { $in: hostListingIds } })
              .sort({ createdAt: -1 })
              .populate("listing", "title slug location country")
              .populate("user", "username fullName")
              .lean()
         : [];
   } else {
      bookings = await Booking.find({ user: req.user._id })
         .sort({ createdAt: -1 })
         .populate("listing", "title slug location country")
         .populate("user", "username fullName")
         .lean();
   }

   res.render("bookings/index.ejs", {
      bookingScope,
      bookings: bookings.map((booking) => ({
         ...booking,
         listing: booking.listing
            ? {
                 ...booking.listing,
                 seoPath: createSeoPath(booking.listing),
              }
            : null,
      })),
      meta: {
         title: "Bookings | WanderLust",
         description: "Review confirmed stays, travel windows, and guest activity across your WanderLust booking flow.",
      },
   });
};

module.exports.cancelBooking = async (req, res) => {
   const booking = await Booking.findById(req.params.bookingId);

   if (!booking) {
      throw new ExpressError(404, "Booking not found.");
   }

   booking.status = "cancelled";
   await booking.save();

   req.flash("success", "Booking cancelled successfully.");
   res.redirect("/bookings");
};
