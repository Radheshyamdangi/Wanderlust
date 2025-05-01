const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



router
.route("/")
//INDEX ROUTE
.get(wrapAsync (listingController.index))
//Create Route
.post(isLoggedIn , upload.single("listing[image]"),
   wrapAsync (listingController.createListing)
);


//New Route
router.get("/new" , isLoggedIn ,listingController.renderNewFrom);



router
.route("/:id")
//SHOW ROUTE
.get( wrapAsync (listingController.showListing))

//Update route
.put(isLoggedIn ,isOwner ,upload.single("listing[image]"), wrapAsync (listingController.updateListing))

//Delete Route
.delete(isLoggedIn ,isOwner, wrapAsync (listingController.destroyListing));









//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner ,wrapAsync (listingController.renderEditform));




module.exports = router;