// Creating instance of JS Error with additional Status property
export class HttpError extends Error {
  /**
   * @param {string} message - The error message.
   * @param {number} [statusCode=500] - The HTTP status code for the error.
   */
  constructor(message, statusCode = 500, code) {
    super(message);
    /** @type {number} */
    this.status = statusCode;
    /** @type {string} */
    this.code = code;
  }
}

/**
 * @param {string} message - The error message.
 * @param {number} [statusCode] - The HTTP status code for the error.
 * @returns {never}
 */
export function throwError(message, statusCode) {
  throw new HttpError(message, statusCode);
}
