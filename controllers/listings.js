const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingCategories, listingSortOptions } = require("../utils/listingOptions.js");
const slugify = require("../utils/slugify.js");

const PAGE_SIZE = 9;

const sortMap = {
   latest: { createdAt: -1 },
   priceAsc: { price: 1, createdAt: -1 },
   priceDesc: { price: -1, createdAt: -1 },
   ratingDesc: { ratingAverage: -1, reviewCount: -1, createdAt: -1 },
};

const createSeoPath = (listing) => {
   const slug = listing.slug || slugify(`${listing.title} ${listing.location}`);
   return `/listings/${listing._id}/${slug}`;
};

const decorateListing = (listing) => ({
   ...listing,
   seoPath: createSeoPath(listing),
});

const parsePage = (page) => {
   const parsed = Number.parseInt(page, 10);
   return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports.home = async (req, res) => {
   const [featuredListings, categoryStats, totalListings, totalHosts] = await Promise.all([
      Listing.find({})
         .sort({ createdAt: -1 })
         .limit(6)
         .select("title slug price location country category image ratingAverage reviewCount")
         .lean(),
      Listing.aggregate([
         { $group: { _id: "$category", count: { $sum: 1 } } },
         { $sort: { count: -1, _id: 1 } },
         { $limit: 4 },
      ]),
      Listing.countDocuments({}),
      User.countDocuments({ role: { $in: ["host", "admin"] } }),
   ]);

   res.render("home.ejs", {
      featuredListings: featuredListings.map(decorateListing),
      categoryStats,
      stats: {
         totalListings,
         totalHosts,
         curatedCategories: listingCategories.length,
      },
      meta: {
         title: "WanderLust | Curated stays for modern travelers",
         description: "Search standout stays by category, compare prices faster, and book trips with clearer user flows on WanderLust.",
      },
   });
};

module.exports.index = async (req, res) => {
   const page = parsePage(req.query.page);
   const filters = {
      q: req.query.q ? req.query.q.trim() : "",
      category: listingCategories.includes(req.query.category) ? req.query.category : "",
      minPrice: req.query.minPrice || "",
      maxPrice: req.query.maxPrice || "",
      minRating: req.query.minRating || "",
      sort: req.query.sort || "latest",
   };

   const query = {};

   if (filters.q) {
      const pattern = escapeRegex(filters.q);
      query.$or = [
         { title: { $regex: pattern, $options: "i" } },
         { location: { $regex: pattern, $options: "i" } },
         { country: { $regex: pattern, $options: "i" } },
      ];
   }

   if (filters.category) {
      query.category = filters.category;
   }

   const price = {};
   if (filters.minPrice !== "") {
      price.$gte = Number(filters.minPrice);
   }
   if (filters.maxPrice !== "") {
      price.$lte = Number(filters.maxPrice);
   }
   if (Object.keys(price).length) {
      query.price = price;
   }

   if (filters.minRating !== "") {
      query.ratingAverage = { $gte: Number(filters.minRating) };
   }

   const sort = sortMap[filters.sort] || sortMap.latest;

   const [listings, totalListings, categoryCounts] = await Promise.all([
      Listing.find(query)
         .sort(sort)
         .skip((page - 1) * PAGE_SIZE)
         .limit(PAGE_SIZE)
         .select("title slug price location country category image ratingAverage reviewCount")
         .lean(),
      Listing.countDocuments(query),
      Listing.aggregate([
         { $group: { _id: "$category", count: { $sum: 1 } } },
         { $sort: { count: -1, _id: 1 } },
      ]),
   ]);

   const totalPages = Math.max(Math.ceil(totalListings / PAGE_SIZE), 1);
   const categoryCountMap = categoryCounts.reduce((accumulator, item) => {
      accumulator[item._id] = item.count;
      return accumulator;
   }, {});

   res.render("listings/index.ejs", {
      listings: listings.map(decorateListing),
      categories: listingCategories,
      categoryCountMap,
      filters,
      pagination: {
         page,
         totalPages,
         totalListings,
      },
      sortOptions: listingSortOptions,
      hasFilters: Boolean(filters.q || filters.category || filters.minPrice || filters.maxPrice || filters.minRating),
      meta: {
         title: filters.category ? `${filters.category} Stays | WanderLust` : "Explore Listings | WanderLust",
         description: "Filter stays by destination, category, budget, and ratings with a travel search flow built for fast discovery.",
      },
   });
};

module.exports.renderNewForm = (req, res) => {
   res.render("listings/new.ejs", {
      categories: listingCategories,
      meta: {
         title: "Create Listing | WanderLust",
         description: "Publish a stay on WanderLust with better structure, pricing, category data, and traveler-ready details.",
      },
   });
};

module.exports.showListing = async (req, res) => {
   const { id, slug } = req.params;
   const listing = await Listing.findById(id)
      .populate({
         path: "reviews",
         options: { sort: { createdAt: -1 } },
         populate: {
            path: "author",
            select: "username fullName role",
         },
      })
      .populate("owner", "username fullName role email")
      .lean();

   if (!listing) {
      req.flash("error", "The listing you requested does not exist.");
      return res.redirect("/listings");
   }

   const canonicalSlug = listing.slug || slugify(`${listing.title} ${listing.location}`);
   if (!slug || slug !== canonicalSlug) {
      return res.redirect(301, `/listings/${id}/${canonicalSlug}`);
   }

   const [relatedListings, bookedDateRanges] = await Promise.all([
      Listing.find({ _id: { $ne: id }, category: listing.category })
         .sort({ ratingAverage: -1, createdAt: -1 })
         .limit(3)
         .select("title slug price location country category image ratingAverage reviewCount")
         .lean(),
      Booking.find({
         listing: id,
         status: "confirmed",
         checkOut: { $gte: new Date() },
      })
         .sort({ checkIn: 1 })
         .select("checkIn checkOut")
         .lean(),
   ]);

   const structuredData = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      name: listing.title,
      description: listing.description,
      image: listing.image?.url,
      address: {
         "@type": "PostalAddress",
         addressCountry: listing.country,
         addressLocality: listing.location,
      },
      aggregateRating: listing.reviewCount
         ? {
              "@type": "AggregateRating",
              ratingValue: listing.ratingAverage,
              reviewCount: listing.reviewCount,
           }
         : undefined,
      url: `${req.protocol}://${req.get("host")}/listings/${listing._id}/${canonicalSlug}`,
   };

   return res.render("listings/show.ejs", {
      listing: {
         ...listing,
         seoPath: createSeoPath(listing),
      },
      relatedListings: relatedListings.map(decorateListing),
      bookedDateRanges,
      structuredData,
      meta: {
         title: `${listing.title} | WanderLust`,
         description: listing.description.slice(0, 155),
         image: listing.image?.url,
      },
   });
};

module.exports.createListing = async (req, res) => {
   const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;

   if (req.file) {
      newListing.image = {
         url: req.file.path,
         filename: req.file.filename,
      };
   }

   await newListing.save();
   req.flash("success", "New listing published successfully.");
   res.redirect(createSeoPath(newListing));
};

module.exports.renderEditForm = async (req, res) => {
   const { id } = req.params;
   const listing = await Listing.findById(id).lean();

   if (!listing) {
      req.flash("error", "The listing you want to edit was not found.");
      return res.redirect("/listings");
   }

   res.render("listings/edit.ejs", {
      listing,
      categories: listingCategories,
      meta: {
         title: `Edit ${listing.title} | WanderLust`,
         description: "Update your listing details, pricing, category, and traveler-facing content.",
      },
   });
};

module.exports.updateListing = async (req, res) => {
   const { id } = req.params;
   const listing = await Listing.findById(id);

   if (!listing) {
      throw new ExpressError(404, "Listing not found.");
   }

   Object.assign(listing, req.body.listing);

   if (req.file) {
      listing.image = {
         url: req.file.path,
         filename: req.file.filename,
      };
   }

   await listing.save();

   req.flash("success", "Listing updated successfully.");
   res.redirect(createSeoPath(listing));
};

module.exports.destroyListing = async (req, res) => {
   const { id } = req.params;
   const deletedListing = await Listing.findByIdAndDelete(id);

   if (!deletedListing) {
      throw new ExpressError(404, "Listing not found.");
   }

   req.flash("success", "Listing deleted successfully.");
   res.redirect("/listings");
};
