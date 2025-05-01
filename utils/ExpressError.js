class ExpressError extends Error {
   constructors (statusCode, message){
      // super();
      this.statusCode = statusCode;
      this.message = message;

   }
}
module.exports = ExpressError;