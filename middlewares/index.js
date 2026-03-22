const auth = require("./auth.js");
const security = require("./security.js");
const validation = require("./validation.js");

module.exports = {
   ...auth,
   ...security,
   ...validation,
};
