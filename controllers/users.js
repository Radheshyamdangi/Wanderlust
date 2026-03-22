const User = require("../models/user");
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { selfServeRoles } = require("../utils/listingOptions.js");
const slugify = require("../utils/slugify.js");

const createSeoPath = (listing) => {
   const slug = listing.slug || slugify(`${listing.title} ${listing.location}`);
   return `/listings/${listing._id}/${slug}`;
};

module.exports.renderSignupform = (req, res) => {
   res.render("users/signup.ejs", {
      roles: selfServeRoles,
      meta: {
         title: "Create Account | WanderLust",
         description: "Join WanderLust as a traveler or host and access a more structured booking and listing experience.",
      },
   });
};

module.exports.signup = async (req, res, next) => {
   try {
      const { username, email, password, fullName, role } = req.body;
      const safeRole = selfServeRoles.includes(role) ? role : "user";
      const newUser = new User({ email, username, fullName, role: safeRole });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
         if (err) {
            return next(err);
         }
         req.flash("success", "Welcome to WanderLust.");
         return res.redirect("/listings");
      });
   } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
   }
};

module.exports.renderLoginForm = (req, res) => {
   res.render("users/login.ejs", {
      meta: {
         title: "Login | WanderLust",
         description: "Sign in to manage bookings, publish listings, and continue planning your next trip.",
      },
   });
};

module.exports.login = async (req, res) => {
   req.flash("success", "Welcome back to WanderLust.");
   const redirectUrl = res.locals.redirectUrl || "/listings";
   delete req.session.redirectUrl;
   res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
   req.logout((err) => {
      if (err) {
         return next(err);
      }
      req.flash("success", "You are logged out.");
      res.redirect("/listings");
   });
};

module.exports.dashboard = async (req, res) => {
   const greetingName = req.user.fullName || req.user.username;

   if (req.user.role === "admin") {
      const [userCount, listingCount, bookingCount, reviewCount, recentListings, recentBookings] = await Promise.all([
         User.countDocuments({}),
         Listing.countDocuments({}),
         Booking.countDocuments({}),
         Review.countDocuments({}),
         Listing.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title slug location country category createdAt")
            .lean(),
         Booking.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("listing", "title slug location country")
            .populate("user", "username fullName")
            .lean(),
      ]);

      return res.render("users/dashboard.ejs", {
         dashboardType: "admin",
         greetingName,
         stats: [
            { label: "Users", value: userCount },
            { label: "Listings", value: listingCount },
            { label: "Bookings", value: bookingCount },
            { label: "Reviews", value: reviewCount },
         ],
         recentListings: recentListings.map((listing) => ({
            ...listing,
            seoPath: createSeoPath(listing),
         })),
         recentBookings,
         meta: {
            title: "Admin Dashboard | WanderLust",
            description: "Track platform growth, recent bookings, and listing activity from the WanderLust admin dashboard.",
         },
      });
   }

   if (req.user.role === "host") {
      const ownedListings = await Listing.find({ owner: req.user._id })
         .sort({ createdAt: -1 })
         .select("title slug price location country category image ratingAverage reviewCount")
         .lean();

      const listingIds = ownedListings.map((listing) => listing._id);
      const incomingBookings = listingIds.length
         ? await Booking.find({ listing: { $in: listingIds } })
              .sort({ createdAt: -1 })
              .limit(6)
              .populate("listing", "title slug location country")
              .populate("user", "username fullName")
              .lean()
         : [];

      return res.render("users/dashboard.ejs", {
         dashboardType: "host",
         greetingName,
         ownedListings: ownedListings.map((listing) => ({
            ...listing,
            seoPath: createSeoPath(listing),
         })),
         incomingBookings,
         meta: {
            title: "Host Dashboard | WanderLust",
            description: "Track your listings, recent guest activity, and property performance on WanderLust.",
         },
      });
   }

   const [bookings, reviews] = await Promise.all([
      Booking.find({ user: req.user._id })
         .sort({ createdAt: -1 })
         .limit(6)
         .populate("listing", "title slug location country image price")
         .lean(),
      Review.find({ author: req.user._id })
         .sort({ createdAt: -1 })
         .limit(5)
         .lean(),
   ]);

   return res.render("users/dashboard.ejs", {
      dashboardType: "user",
      greetingName,
      bookings: bookings.map((booking) => ({
         ...booking,
         listing: booking.listing
            ? {
                 ...booking.listing,
                 seoPath: createSeoPath(booking.listing),
              }
            : null,
      })),
      reviews,
      meta: {
         title: "Dashboard | WanderLust",
         description: "Review your recent bookings, travel activity, and account actions in one clean WanderLust dashboard.",
      },
   });
};
