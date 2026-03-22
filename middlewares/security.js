const ExpressError = require("../utils/ExpressError.js");

const buckets = new Map();

const buildOriginHost = (value) => {
   try {
      return new URL(value).host;
   } catch (error) {
      return null;
   }
};

module.exports.requestLogger = (req, res, next) => {
   const startedAt = Date.now();

   res.on("finish", () => {
      const elapsed = Date.now() - startedAt;
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${elapsed}ms`);
   });

   next();
};

module.exports.securityHeaders = (req, res, next) => {
   res.set({
      "Cross-Origin-Opener-Policy": "same-origin",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
   });

   next();
};

module.exports.verifySameOrigin = (req, res, next) => {
   const protectedMethods = ["POST", "PUT", "PATCH", "DELETE"];

   if (!protectedMethods.includes(req.method)) {
      return next();
   }

   const source = req.get("origin") || req.get("referer");
   if (!source) {
      return next();
   }

   const sourceHost = buildOriginHost(source);
   const currentHost = req.get("host");

   if (sourceHost && currentHost && sourceHost !== currentHost) {
      return next(new ExpressError(403, "Blocked a cross-site request."));
   }

   return next();
};

module.exports.createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 150, key = "global" } = {}) => {
   return (req, res, next) => {
      const now = Date.now();
      const bucketKey = `${key}:${req.ip}`;
      const current = buckets.get(bucketKey);

      if (!current || now - current.startedAt > windowMs) {
         buckets.set(bucketKey, { count: 1, startedAt: now });
         return next();
      }

      current.count += 1;

      if (current.count > max) {
         return next(new ExpressError(429, "Too many requests. Please try again in a moment."));
      }

      if (buckets.size > 5000) {
         for (const [storedKey, value] of buckets.entries()) {
            if (now - value.startedAt > windowMs) {
               buckets.delete(storedKey);
            }
         }
      }

      return next();
   };
};

module.exports.attachSeoDefaults = (req, res, next) => {
   const protocol = req.secure ? "https" : "http";

   res.locals.meta = {
      title: "WanderLust | Curated stays and smart travel planning",
      description: "Discover curated homes, flexible booking flows, and destination filters built for modern travel planning.",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
      url: `${protocol}://${req.get("host")}${req.originalUrl}`,
   };

   res.locals.currentPath = req.path;
   next();
};
