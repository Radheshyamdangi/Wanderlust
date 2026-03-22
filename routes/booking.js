const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { canManageBooking, isLoggedIn } = require("../middlewares");

router.get("/", isLoggedIn, wrapAsync(bookingController.index));
router.delete("/:bookingId", isLoggedIn, wrapAsync(canManageBooking), wrapAsync(bookingController.cancelBooking));

module.exports = router;
