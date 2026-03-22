if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const {
   attachSeoDefaults,
   createRateLimiter,
   requestLogger,
   securityHeaders,
   verifySameOrigin,
} = require("./middlewares");
const { listingCategories } = require("./utils/listingOptions.js");
const listingController = require("./controllers/listings.js");

const listingRouter = require("./routes/listing.js");
const bookingRouter = require("./routes/booking.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const PORT = process.env.PORT || 8080;
const dbUrl = process.env.ATLASDB_URL || process.env.MONGO_URL;

if (!dbUrl) {
   throw new Error("ATLASDB_URL or MONGO_URL must be defined in the environment.");
}

main()
   .then(() => {
      console.log("connected to DB");
   })
   .catch((err) => {
      console.log(err);
   });

async function main() {
   await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.disable("x-powered-by");
app.engine("ejs", ejsMate);

if (process.env.NODE_ENV === "production") {
   // Render sits behind a proxy, so Express must trust it for secure cookies.
   app.set("trust proxy", 1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.locals.listingCategories = listingCategories;

const sessionOptions = {
   secret: process.env.SESSION_SECRET || "wanderlust-dev-session-secret",
   resave: false,
   saveUninitialized: false,
   proxy: process.env.NODE_ENV === "production",
   name: "wanderlust.sid",
   cookie: {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
   },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(requestLogger);
app.use(securityHeaders);
app.use(attachSeoDefaults);
app.use(verifySameOrigin);
app.use(createRateLimiter());
app.use("/login", createRateLimiter({ windowMs: 10 * 60 * 1000, max: 20, key: "login" }));
app.use("/signup", createRateLimiter({ windowMs: 10 * 60 * 1000, max: 15, key: "signup" }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   res.locals.currentYear = new Date().getFullYear();
   next();
});

app.get("/", wrapAsync(listingController.home));

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/bookings", bookingRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
   next(new ExpressError(404, "Page not found."));
});

app.use((err, req, res, next) => {
   const { statusCode = 500, message = "Something went wrong." } = err;
   if (process.env.NODE_ENV !== "production") {
      console.error(err);
   }
   res.status(statusCode).render("error.ejs", {
      message,
      meta: {
         title: "Something went wrong | WanderLust",
         description: "The page could not be completed. Please try again or head back to WanderLust listings.",
      },
   });
});

app.listen(PORT, () => {
   console.log(`server is listening on port ${PORT}`);
});
