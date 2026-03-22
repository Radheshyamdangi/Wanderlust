const listingCategories = [
   "Beach",
   "Mountain",
   "City",
   "Heritage",
   "Desert",
   "Lake",
   "Backwater",
   "Spiritual",
   "Wildlife",
   "Hill Station",
];

const listingSortOptions = [
   { value: "latest", label: "Newest" },
   { value: "priceAsc", label: "Price: Low to High" },
   { value: "priceDesc", label: "Price: High to Low" },
   { value: "ratingDesc", label: "Top Rated" },
];

const selfServeRoles = ["user", "host"];
const allRoles = ["user", "host", "admin"];

module.exports = {
   allRoles,
   listingCategories,
   listingSortOptions,
   selfServeRoles,
};
