const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl, validateSignup } = require("../middlewares");
const userController = require("../controllers/users.js");

router
   .route("/signup")
   .get(userController.renderSignupform)
   .post(validateSignup, wrapAsync(userController.signup));

router
   .route("/login")
   .get(userController.renderLoginForm)
   .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

router.get("/logout", userController.logout);
router.get("/dashboard", isLoggedIn, wrapAsync(userController.dashboard));

module.exports = router;
