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
 * @param {number} [statusCode=500] - The HTTP status code for the error.
 * @returns {never}
 */
export function throwError(message, statusCode) {
  throw new HttpError(message, statusCode);
}

// export const codes = {
//   VALIDATION_ERROR: "VALIDATION_ERROR",
//   DUPLICATION_ERROR: "DUPLICATION_ERROR",
//   INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
//   INPUT_PARSE_ERROR: "INPUT_PARSE_ERROR",
//   NOT_FOUND: "NOT_FOUND",
//   NOT_AUTHORIZED: "NOT_AUTHORIZED",
//   FORBIDDEN: "FORBIDDEN",
//   ERROR: "ERROR",
//   TIMEOUT: "TIMEOUT",
//   FORBIDDEN: "FORBIDDEN",
//   PRECONDITION_FAILED: "PRECONDITION_FAILED",
//   PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
//   METHOD_NOT_SUPPORTED: "METHOD_NOT_SUPPORTED",
//   UNPROCESSABLE_CONTENT: "UNPROCESSABLE_CONTENT",
//   TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
//   CLIENT_CLOSED_REQUEST: "CLIENT_CLOSED_REQUEST",
//   INSUFFICIENT_CREDITS: "INSUFFICIENT_CREDITS",
//   PAYMENT_REQUIRED: "PAYMENT_REQUIRED",
//   VERIFICATION_TOKEN_SEND: "VERIFICATION_TOKEN_SEND",
//   CONFLICT: "CONFLICT",
// };
