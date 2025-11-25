export default class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.name = "Unauthorized";
    this.code = 401;
    this.statusCode = 401;
    Error.captureStackTrace(this, this.constructor);
  }
}
